// 블루마 DB(floweropdb) → 우리 data/*.json 읽기전용 동기화.
// DB는 절대 수정하지 않음(SELECT만). 우리 화원(S0000149)의 활성 상품/가격/이미지/설명을 가져옴.
// 카테고리는 기존 웹사이트 진열 카테고리(101~111, 배너이미지 키)를 이름으로 매핑해 유지하고,
// 용도별(201~207)은 기존 것을 보존(활성상품으로 필터). DB에만 있는 분류는 새 카테고리로 추가.
//
// 실행: (프로젝트 루트에서) DB 접속정보 env 설정 후
//   node scraper/sync-from-db.mjs
import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// .env 가 있으면 로드 (dotenv 의존성 없이 간단 파싱)
const envPath = path.join(root, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
const SHOP = 'S0000149';
const CDN = 'https://resource.flowerteam.kr/images/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36';

const cfg = {
  host: process.env.DB_HOST, port: +(process.env.DB_PORT || 3306),
  user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME,
  connectTimeout: 15000,
};
const basename = (uri) => (uri ? String(uri).split('/').pop() : null);

const conn = await mysql.createConnection(cfg);
console.log('DB 접속:', cfg.host + ':' + cfg.port + '/' + cfg.database);

// 1) 활성 상품 + 분류명
const [prodRows] = await conn.query(
  `SELECT p.PRODUCT_ID id, p.PRODUCT_NAME name, p.CATEGORY_ID cid, p.DISPLAY_SORT sort, c.CATEGORY_NAME cname
   FROM PD_PRODUCT p LEFT JOIN PD_PRODUCT_CATEGORY c ON p.SHOP_ID=c.SHOP_ID AND p.CATEGORY_ID=c.CATEGORY_ID
   WHERE p.SHOP_ID=? AND p.USE_YN=1 AND p.PRODUCT_TYPE='1' AND p.CATEGORY_ID<>'00'
   ORDER BY p.DISPLAY_SORT, p.PRODUCT_ID`, [SHOP]);
const activeIds = new Set(prodRows.map((r) => r.id));
console.log('활성 상품:', prodRows.length);

// 2) 가격(옵션) — 활성상품만
const [priceRows] = await conn.query(
  `SELECT PRODUCT_ID id, PRICE_SEQ_NO seq, PRICE_NAME pname, PRICE price, MIN_PRICE minp, MAIN_YN main, DISPLAY_SORT sort,
          LARGE_IMAGE_URI lg, MEDIUM_IMAGE_URI med, SMALL_IMAGE_URI sm
   FROM PD_PRODUCT_PRICE WHERE SHOP_ID=? ORDER BY PRODUCT_ID, DISPLAY_SORT, PRICE_SEQ_NO`, [SHOP]);
const pricesByProduct = new Map();
for (const r of priceRows) {
  if (!activeIds.has(r.id)) continue;
  if (!pricesByProduct.has(r.id)) pricesByProduct.set(r.id, []);
  pricesByProduct.get(r.id).push(r);
}

// 3) 상세설명
const [descRows] = await conn.query(`SELECT PRODUCT_ID id, DESCRIPTION d, HTML_YN h FROM PD_PRODUCT_DESC WHERE SHOP_ID=?`, [SHOP]);
const descByProduct = new Map(descRows.filter((r) => activeIds.has(r.id)).map((r) => [r.id, r.d || '']));

// 4) 상세이미지
const [descImgRows] = await conn.query(
  `SELECT PRODUCT_ID id, IMAGE_PATH p, DISPLAY_SORT sort FROM PD_PRODUCT_DESC_IMAGE WHERE SHOP_ID=? ORDER BY PRODUCT_ID, DISPLAY_SORT`, [SHOP]);
const descImgByProduct = new Map();
for (const r of descImgRows) {
  if (!activeIds.has(r.id) || !r.p) continue;
  if (!descImgByProduct.has(r.id)) descImgByProduct.set(r.id, []);
  descImgByProduct.get(r.id).push(r.p); // 전체경로 보존 (default/ 폴더도 있음)
}

await conn.end();

// --- 카테고리 매핑 준비: 기존 categories.json의 웹사이트 카테고리(이름→객체) ---
const oldCats = JSON.parse(fs.readFileSync(path.join(root, 'data/categories.json'), 'utf-8'));
const webProductCats = oldCats.filter((c) => c.group === 'product');
const purposeCats = oldCats.filter((c) => c.group === 'purpose');
const nameToWebCat = new Map(webProductCats.map((c) => [c.name, c]));

// 새 카테고리(웹에 없던 DB분류) 모음
const extraCats = new Map(); // dbCategoryName -> category object

function resolveCategoryId(dbName) {
  if (!dbName) return null;
  const w = nameToWebCat.get(dbName);
  if (w) return w.id;
  if (!extraCats.has(dbName)) {
    extraCats.set(dbName, { id: 'X' + (extraCats.size + 1), name: dbName, group: 'product', count: 0, productIds: [] });
  }
  return extraCats.get(dbName).id;
}

// --- 상품 객체 빌드 ---
const products = {};
const imagesToFetch = new Map(); // localRelPath -> cdnUrl

function regProdImg(uri) {
  // uri 예: fs_prod/S0000149/27745_2_M.jpg, fs_prod/basic/6426_medium.jpg 등 경로가 제각각.
  // 실제 전체경로에서 받아 우리 fs_prod/S0000149/<파일명> 으로 정규화 저장. 파일명만 반환.
  if (!uri) return null;
  const file = basename(uri);
  imagesToFetch.set(`fs_prod/${SHOP}/${file}`, CDN + uri);
  return file;
}
function regDescImg(fullPath) {
  // fullPath 예: fs_prod_desc/S0000149/030011_1.jpg 또는 fs_prod_desc/default/34488_1.jpg
  const file = basename(fullPath);
  imagesToFetch.set(`fs_prod_desc/${SHOP}/${file}`, CDN + fullPath); // 원본 경로에서 받아 우리 S0000149 폴더로 저장
  return file;
}

for (const p of prodRows) {
  const prices = pricesByProduct.get(p.id) || [];
  const primary = prices.find((x) => x.main === 1) || prices[0] || null;
  const options = prices.map((x) => ({
    price: x.price, salePrice: x.price, discount: 0,
    name: x.pname || '',
    mediumImage: regProdImg(x.med), smallImage: regProdImg(x.sm),
  }));
  const images = primary
    ? { large: regProdImg(primary.lg), medium: regProdImg(primary.med), small: regProdImg(primary.sm),
        desc: (descImgByProduct.get(p.id) || []).map(regDescImg) }
    : { large: null, medium: null, small: null, desc: (descImgByProduct.get(p.id) || []).map(regDescImg) };
  const catId = resolveCategoryId(p.cname);
  products[p.id] = {
    productId: p.id,
    name: p.name,
    badge: p.cname || '',
    price: primary ? primary.price : 0,
    options,
    categories: catId ? [catId] : [],
    images,
    description: descByProduct.get(p.id) || '',
  };
}

// --- 카테고리 재구성 ---
// 상품분류: 웹 카테고리 + 추가분류, productIds/count 재계산 (상품 있는 것만 유지)
const allProductCats = [...webProductCats.map((c) => ({ ...c, productIds: [], count: 0 })), ...extraCats.values()];
const catById = new Map(allProductCats.map((c) => [c.id, c]));
for (const pid of Object.keys(products)) {
  for (const cid of products[pid].categories) {
    const c = catById.get(cid);
    if (c) c.productIds.push(pid);
  }
}
allProductCats.forEach((c) => { c.count = c.productIds.length; });
const keptProductCats = allProductCats.filter((c) => c.count > 0);

// 용도별: 기존 보존하되 활성상품으로 필터
const keptPurpose = purposeCats.map((c) => {
  const ids = (c.productIds || []).filter((pid) => products[pid]);
  return { ...c, productIds: ids, count: ids.length };
}).filter((c) => c.count > 0);

const categories = [...keptProductCats, ...keptPurpose];

// --- 저장 ---
fs.writeFileSync(path.join(root, 'data/products.json'), JSON.stringify(products, null, 2) + '\n', 'utf-8');
fs.writeFileSync(path.join(root, 'data/categories.json'), JSON.stringify(categories, null, 2) + '\n', 'utf-8');
console.log('저장: products', Object.keys(products).length, '/ categories', categories.length,
  '(상품분류', keptProductCats.length, '+ 용도별', keptPurpose.length, ')');
if (extraCats.size) console.log('새로 추가된 분류:', [...extraCats.values()].map((c) => `${c.id}:${c.name}`).join(', '));

// --- 이미지 다운로드 (없는 것만) ---
const imgDir = path.join(root, 'assets/images');
let need = 0, got = 0, fail = 0, skip = 0;
const entries = [...imagesToFetch.entries()];
console.log('\n참조 이미지:', entries.length, '개 — 없는 것만 다운로드...');
async function fetchOne([rel, url]) {
  const dest = path.join(imgDir, rel);
  if (fs.existsSync(dest)) { skip++; return; }
  need++;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) { fail++; return; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) { fail++; return; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    got++;
  } catch { fail++; }
}
// 동시성 8
const queue = entries.slice();
async function worker() { while (queue.length) await fetchOne(queue.shift()); }
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`이미지: 기존 ${skip} / 신규필요 ${need} / 성공 ${got} / 실패 ${fail}`);
console.log('\n✅ 동기화 완료');
