// 용도별 카테고리(201~207)의 상품ID를 라이브에서 보강 → categories.json 업데이트
// 1단계 스크래퍼가 상품분류(101~111)만 채우고 용도별을 비워둬서 보완하는 스크립트.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const BASE = 'https://nankorea.flowerteam.kr';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36';

const products = JSON.parse(fs.readFileSync(path.join(root, 'data/products.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(root, 'data/categories.json'), 'utf-8'));
const have = (id) => Object.prototype.hasOwnProperty.call(products, id);

const usageIds = categories.filter((c) => c.group === 'purpose').map((c) => c.id);

for (const cid of usageIds) {
  const url = `${BASE}/shop/shopproduct/productList?categoryId=${cid}`;
  const html = await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => r.text());
  const re = new RegExp(`productDetail\\?categoryId=${cid}&productId=([A-Za-z0-9]+)`, 'g');
  const ids = [...new Set([...html.matchAll(re)].map((m) => m[1]))];
  const owned = ids.filter(have); // 우리 보유 상품만
  const cat = categories.find((c) => c.id === cid);
  cat.productIds = owned;
  cat.count = owned.length;
  console.log(`${cid} ${cat.name}: 원본 ${ids.length}개 → 보유 ${owned.length}개`);
}

fs.writeFileSync(path.join(root, 'data/categories.json'), JSON.stringify(categories, null, 2) + '\n', 'utf-8');
console.log('categories.json 갱신 완료');
