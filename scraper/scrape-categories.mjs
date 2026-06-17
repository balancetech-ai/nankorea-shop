// 한국난원(블루샵 S0000149) 카테고리 목록 스크래퍼
// 19개 카테고리의 productList 페이지에서 상품ID/이름/가격/이미지를 추출한다.
// 결과: data/categories.json (카테고리 메타 + 상품ID 매핑), data/products-list.json (상품 기본정보 맵)
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BASE = "https://nankorea.flowerteam.kr";

// 원본 nav에서 확인한 카테고리 (상품별 9 + 용도별 7)
const CATEGORIES = [
  { id: "103", name: "동양란",   group: "product" },
  { id: "104", name: "서양란",   group: "product" },
  { id: "101", name: "근조화환", group: "product" },
  { id: "102", name: "축하화환", group: "product" },
  { id: "105", name: "꽃바구니", group: "product" },
  { id: "111", name: "과일바구니", group: "product" },
  { id: "107", name: "관엽식물", group: "product" },
  { id: "108", name: "공기정화", group: "product" },
  { id: "109", name: "분재",     group: "product" },
  { id: "201", name: "축하/생일&기념일", group: "purpose" },
  { id: "202", name: "사랑고백&프로포즈", group: "purpose" },
  { id: "203", name: "개업&창업&이전", group: "purpose" },
  { id: "204", name: "승진&취업&영전", group: "purpose" },
  { id: "205", name: "병문안&돌&출산", group: "purpose" },
  { id: "206", name: "행사&결혼&회갑", group: "purpose" },
  { id: "207", name: "조문&추모&영결", group: "purpose" },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// paging 영역에서 최대 페이지 번호를 알아낸다
function parseMaxPage(html) {
  let max = 1;
  const re = /goPage\('?(\d+)'?\)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const n = Number(m[1]);
    if (n > max) max = n;
  }
  return max;
}

// goPage(pageNum) 재현: ?c=<urlencode(폼serialize + '&pageNo='+n)>&categoryId=ID
async function fetchCategoryPage(categoryId, pageNo) {
  if (pageNo <= 1) {
    return fetchHtml(`${BASE}/shop/shopproduct/productList?categoryId=${categoryId}`);
  }
  const inner =
    `categoryId=${categoryId}&minPrice=&maxPrice=&pageNo=` +
    `&productNameSort=false&lowPriceSort=false&highPriceSort=false&pageNo=${pageNo}`;
  const url =
    `${BASE}/shop/shopproduct/productList` +
    `?c=${encodeURIComponent(inner)}&categoryId=${categoryId}`;
  return fetchHtml(url);
}

// 전체상품 리스트(section.subItemlist 내 div.largelist4)의 각 <dl> 블록을 파싱
function parseProductList(html, categoryId) {
  // 전체상품 리스트 영역만 잘라낸다 (베스트 진열 중복 방지)
  const startMarker = html.indexOf("largelist4");
  const region = startMarker >= 0 ? html.slice(startMarker) : html;

  const items = [];
  const dlRegex = /<dl>([\s\S]*?)<\/dl>/g;
  let m;
  while ((m = dlRegex.exec(region)) !== null) {
    const block = m[1];

    const idMatch = block.match(/productDetail\?categoryId=\d+&productId=([A-Za-z0-9]+)/);
    if (!idMatch) continue;
    const productId = idMatch[1];

    const nameMatch = block.match(/<dd class="pname">\s*<a[^>]*>([\s\S]*?)<\/a>/);
    const name = nameMatch ? decodeEntities(nameMatch[1].trim()) : "";

    const priceMatch = block.match(/<dd\s*>\s*([\d,]+)\s*원/);
    const price = priceMatch ? Number(priceMatch[1].replace(/,/g, "")) : null;

    const imgMatch = block.match(/fs_prod\/S0000149\/([A-Za-z0-9_]+\.(?:png|jpg|gif))/i);
    const image = imgMatch ? imgMatch[1] : null;

    items.push({ productId, name, price, image });
  }
  return items;
}

async function main() {
  await mkdir(join(ROOT, "data"), { recursive: true });

  const categoriesOut = [];
  const productsMap = {}; // productId -> { id, name, price, image, categories: [] }

  for (const cat of CATEGORIES) {
    process.stdout.write(`[${cat.id}] ${cat.name} ... `);
    let items = [];
    try {
      const firstHtml = await fetchCategoryPage(cat.id, 1);
      const maxPage = parseMaxPage(firstHtml);
      items = parseProductList(firstHtml, cat.id);
      for (let p = 2; p <= maxPage; p++) {
        await new Promise((r) => setTimeout(r, 250));
        const html = await fetchCategoryPage(cat.id, p);
        items.push(...parseProductList(html, cat.id));
      }
      process.stdout.write(`(${maxPage}p) `);
    } catch (e) {
      console.log(`ERROR ${e.message}`);
      categoriesOut.push({ ...cat, productIds: [], error: e.message });
      continue;
    }
    // 카테고리 내 중복 productId 제거 (페이지 경계 안전장치)
    const seen = new Set();
    items = items.filter((it) => (seen.has(it.productId) ? false : seen.add(it.productId)));

    const productIds = [];
    for (const it of items) {
      productIds.push(it.productId);
      if (!productsMap[it.productId]) {
        productsMap[it.productId] = {
          productId: it.productId,
          name: it.name,
          listPrice: it.price,
          listImage: it.image,
          categories: [],
        };
      }
      if (!productsMap[it.productId].categories.includes(cat.id)) {
        productsMap[it.productId].categories.push(cat.id);
      }
    }
    categoriesOut.push({ ...cat, count: productIds.length, productIds });
    console.log(`${productIds.length}개`);
    await new Promise((r) => setTimeout(r, 300)); // 예의상 딜레이
  }

  const totalProducts = Object.keys(productsMap).length;
  await writeFile(
    join(ROOT, "data", "categories.json"),
    JSON.stringify(categoriesOut, null, 2),
    "utf-8"
  );
  await writeFile(
    join(ROOT, "data", "products-list.json"),
    JSON.stringify(productsMap, null, 2),
    "utf-8"
  );

  console.log(`\n완료: 카테고리 ${categoriesOut.length}개, 고유 상품 ${totalProducts}개`);
  console.log(`→ data/categories.json, data/products-list.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
