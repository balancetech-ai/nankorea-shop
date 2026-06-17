// 라이브 원본(nankorea.flowerteam.kr)의 카테고리별 상품 "진열순서"를 스크랩.
// 페이징: productList?c=pageNo%3DN&categoryId=ID (blueshop 방식). 전체상품 리스트(largelist4) 구간만 순서대로.
// 산출: data/_original-order.json = { categoryId: [productId,...] }  (사용처: reorder-from-original.mjs)
import fs from 'fs';

const BASE = 'https://nankorea.flowerteam.kr/shop/shopproduct/productList';
// 원본 웹 카테고리 ID (상품분류 + 폭포석/기타 후보 110/111 + 용도별 201~207)
const IDS = ['101', '102', '103', '104', '105', '107', '108', '109', '110', '111',
             '201', '202', '203', '204', '205', '206', '207'];

function extractListOrder(html) {
  const i = html.indexOf('class="largelist4"');
  if (i < 0) return [];
  const end = html.indexOf('</section>', i);
  const seg = html.slice(i, end < 0 ? undefined : end);
  const ids = [];
  const seen = new Set();
  const re = /productId=([0-9A-Za-z]+)/g;
  let m;
  while ((m = re.exec(seg))) { if (!seen.has(m[1])) { seen.add(m[1]); ids.push(m[1]); } }
  return ids;
}

async function fetchCat(id) {
  const all = [];
  const have = new Set();
  let prevSig = null;
  for (let page = 1; page <= 30; page++) {
    const url = page === 1
      ? `${BASE}?categoryId=${id}`
      : `${BASE}?c=pageNo%3D${page}&categoryId=${id}`;
    let html;
    try { html = await (await fetch(url)).text(); } catch (e) { break; }
    const ids = extractListOrder(html);
    if (ids.length === 0) break;
    const sig = ids.join(',');
    if (sig === prevSig) break;        // 같은 페이지 반복 = 끝
    let added = 0;
    for (const pid of ids) { if (!have.has(pid)) { have.add(pid); all.push(pid); added++; } }
    prevSig = sig;
    if (added === 0) break;            // 새 상품 없음 = 끝 (largelist4는 페이지당 16개)
  }
  return all;
}

const out = {};
for (const id of IDS) {
  out[id] = await fetchCat(id);
  console.error(`cat ${id}: ${out[id].length} products`);
}
fs.writeFileSync('data/_original-order.json', JSON.stringify(out, null, 1));
console.error('-> data/_original-order.json 작성 완료');
