// 우리 카탈로그를 "현재 라이브 쇼핑몰"과 일치시킴 (DB가 아니라 실제 노출 상품 기준).
// 근거: data/_original-order.json (라이브 카테고리별 진열 상품/순서). 라이브 ⊆ 우리(가져올 것 0), 우리 - 라이브 = 제거.
// - 메뉴 노출 카테고리만 유지: 상품분류 103/104/101/102/105/107/108/109 + 기타(라이브111=우리X2) + 용도별 201~207
// - 폭포석(X1)은 라이브 메뉴에 없어 분류·상품 제거. 라이브110(비메뉴 숨은분류) 전용 상품도 제외.
// - products.json: keep-set 만 유지(상품 데이터는 그대로 보존, 빼기만). categories.json: 라이브 순서/멤버십/카운트로 재작성.
import fs from 'fs';

const orig = JSON.parse(fs.readFileSync('data/_original-order.json', 'utf8'));
const cats = JSON.parse(fs.readFileSync('data/categories.json', 'utf8'));
const prods = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

// 우리 카테고리 id -> 라이브 카테고리 id (대부분 동일, X2=기타->라이브111). X1=폭포석은 제거(null).
const LIVE_ID = { X2: '111', X1: null };
const liveIdOf = (c) => (c.id in LIVE_ID ? LIVE_ID[c.id] : (orig[c.id] ? c.id : null));

// keep-set = 유지되는 모든 카테고리의 라이브 상품 union
const keep = new Set();
for (const c of cats) {
  const lid = liveIdOf(c);
  if (lid && orig[lid]) orig[lid].forEach((p) => keep.add(p));
}

// 1) products.json 축소 (keep-set 만)
const beforeProd = Object.keys(prods).length;
const newProds = {};
for (const pid of Object.keys(prods)) if (keep.has(pid)) newProds[pid] = prods[pid];
const removed = beforeProd - Object.keys(newProds).length;

// 2) categories.json 재작성: 라이브 순서/멤버십/카운트. X1(라이브 없음) 제거.
const newCats = [];
for (const c of cats) {
  const lid = liveIdOf(c);
  if (!lid || !orig[lid]) { console.error(`제거 분류: ${c.id} ${c.name} (라이브 미존재)`); continue; }
  const ids = orig[lid].filter((p) => keep.has(p)); // 라이브 순서 그대로
  newCats.push({ ...c, productIds: ids, count: ids.length });
  console.error(`${c.id} ${c.name}: ${c.productIds.length} → ${ids.length}`);
}

fs.writeFileSync('data/products.json', JSON.stringify(newProds, null, 2) + '\n');
fs.writeFileSync('data/categories.json', JSON.stringify(newCats, null, 2) + '\n');
console.error(`\nproducts.json: ${beforeProd} → ${Object.keys(newProds).length} (${removed} 제거)`);
console.error(`categories: ${cats.length} → ${newCats.length}`);
