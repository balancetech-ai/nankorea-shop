'use strict';

// 데이터 저장소 — products.json / categories.json 을 메모리에 들고 있다가
// 관리자 수정 시 디스크에 다시 기록. 쇼핑몰(server)과 관리자(admin)가 같은 인스턴스를 공유.
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(dataDir, 'products.json');
const CATEGORIES_FILE = path.join(dataDir, 'categories.json');

// products.json 은 productId 를 키로 가진 객체
let productsObj = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
if (Array.isArray(productsObj)) {
  productsObj = Object.fromEntries(productsObj.map((p) => [p.productId, p]));
}
let categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf-8'));

function persist() {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsObj, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2) + '\n', 'utf-8');
}

// --- 읽기 ---
function list() {
  return Object.values(productsObj);
}
function get(id) {
  return productsObj[id] || null;
}
function categoriesAll() {
  return categories;
}
function categoryById(id) {
  return categories.find((c) => c.id === id) || null;
}
function navCategories() {
  return categories.filter((c) => c.group === 'product');
}
function purposeCategories() {
  return categories.filter((c) => c.group === 'purpose');
}
function exists(id) {
  return Object.prototype.hasOwnProperty.call(productsObj, id);
}

// 새 상품 ID 생성 (관리자 등록분은 NK 접두어)
function newProductId() {
  let id;
  do {
    id = 'NK' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 100);
  } while (exists(id));
  return id;
}

// 카테고리 소속 동기화: 상품을 선택된 카테고리에만 넣고 나머지에선 뺀다
function syncCategories(productId, catIds) {
  const set = new Set(catIds || []);
  categories.forEach((c) => {
    c.productIds = c.productIds || [];
    const has = c.productIds.includes(productId);
    const should = set.has(c.id);
    if (should && !has) c.productIds.unshift(productId);
    if (!should && has) c.productIds = c.productIds.filter((x) => x !== productId);
    c.count = c.productIds.length;
  });
}

// --- 쓰기 ---
function upsert(product) {
  productsObj[product.productId] = product;
  syncCategories(product.productId, product.categories || []);
  persist();
  return product;
}

function remove(id) {
  delete productsObj[id];
  categories.forEach((c) => {
    if (c.productIds && c.productIds.includes(id)) {
      c.productIds = c.productIds.filter((x) => x !== id);
      c.count = c.productIds.length;
    }
  });
  persist();
}

// 가격만 빠르게 변경
function updatePrice(id, price) {
  const p = productsObj[id];
  if (!p) return null;
  p.price = price;
  if (Array.isArray(p.options) && p.options[0]) {
    p.options[0].price = price;
    p.options[0].salePrice = price;
  }
  persist();
  return p;
}

module.exports = {
  list, get, exists, categoriesAll, categoryById, navCategories, purposeCategories,
  newProductId, upsert, remove, updatePrice, persist,
};
