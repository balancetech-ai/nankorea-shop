'use strict';

// 전용 관리자 페이지 — 상품/카테고리 추가·수정·삭제·가격변경·이미지업로드.
// 변경은 store 를 통해 data/*.json 에 저장되어 쇼핑몰에 즉시 반영된다.
const express = require('express');
const path = require('path');
const multer = require('multer');
const store = require('./store');

const SHOP_ID = 'S0000149';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nankorea1948';
const PAGE_SIZE = 20;

// 원본 쇼핑몰 회사정보 (블루샵 footer 응답 기준) — server 와 공유
const SHOP_INFO = {
  companyName: '한국난원',
  representName: '박창규',
  businessNo: '211-99-36679',
  callCenterNo: '02-3477-7171',
  faxNo: '02-3477-7184',
  email: 'nankorea33@naver.com',
  address: '서울 강남구 세곡동 74-5번지',
  eCommerceRegNo: '강남-03246호',
  // 원본 무통장 계좌번호 안내 = 입금계좌(type 02) 2개만, 가로 2칸 정렬
  accounts: [
    { no: '068-02-060073', firm: 'NH농협(농협중앙회)', depositor: '한국난원' },
    { no: '096-25-0012-675', firm: '국민은행', depositor: '박창규' },
  ],
};

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// --- 간단 쿠키 세션 (DB/세션라이브러리 없이) ---
const sessions = new Set();
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1));
  });
  return out;
}
function isAuthed(req) {
  const c = parseCookies(req);
  return c.nk_admin && sessions.has(c.nk_admin);
}

// --- 이미지 업로드 (상품 대표이미지) ---
const uploadDir = path.join(__dirname, 'assets', 'images', 'fs_prod', SHOP_ID);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    cb(null, `up_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

// --- 로그인 ---
router.get('/login', (req, res) => {
  if (isAuthed(req)) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});
router.post('/login', (req, res) => {
  if ((req.body.password || '') === ADMIN_PASSWORD) {
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessions.add(token);
    res.setHeader('Set-Cookie', `nk_admin=${token}; Path=/admin; HttpOnly; Max-Age=43200`);
    return res.redirect('/admin');
  }
  res.status(401).render('admin/login', { error: '비밀번호가 올바르지 않습니다.' });
});
router.get('/logout', (req, res) => {
  const c = parseCookies(req);
  if (c.nk_admin) sessions.delete(c.nk_admin);
  res.setHeader('Set-Cookie', 'nk_admin=; Path=/admin; Max-Age=0');
  res.redirect('/admin/login');
});

// --- 이후 라우트는 인증 필요 ---
router.use((req, res, next) => {
  if (!isAuthed(req)) return res.redirect('/admin/login');
  res.locals.fmtPrice = (n) => `${Number(n || 0).toLocaleString('ko-KR')}원`;
  res.locals.imgProd = (file) => (file ? `/assets/images/fs_prod/${SHOP_ID}/${file}` : null);
  res.locals.navCats = store.navCategories();
  res.locals.purposeCats = store.purposeCategories();
  next();
});

// --- 대시보드 ---
router.get('/', (req, res) => {
  const all = store.list();
  res.render('admin/dashboard', {
    title: '대시보드',
    productCount: all.length,
    categoryCount: store.categoriesAll().length,
    noImageCount: all.filter((p) => !(p.images && p.images.medium)).length,
    recent: all.slice(-8).reverse(),
  });
});

// --- 상품 목록 (검색/카테고리필터/페이지) ---
router.get('/products', (req, res) => {
  const q = (req.query.q || '').trim();
  const cat = req.query.cat || '';
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  let list = store.list();
  if (q) list = list.filter((p) => p.name && p.name.includes(q));
  if (cat) list = list.filter((p) => (p.categories || []).includes(cat));
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.render('admin/products', { title: '상품관리', items, total, q, cat, page, pages });
});

// --- 상품 등록 폼 ---
router.get('/products/new', (req, res) => {
  res.render('admin/product-form', { title: '상품등록', product: null });
});

// --- 상품 수정 폼 ---
router.get('/products/:id/edit', (req, res) => {
  const product = store.get(req.params.id);
  if (!product) return res.status(404).send('상품을 찾을 수 없습니다.');
  res.render('admin/product-form', { title: '상품수정', product });
});

// 폼 → 상품 객체
function buildProduct(body, file, existing) {
  const id = existing
    ? existing.productId
    : (body.productId && body.productId.trim() ? body.productId.trim() : store.newProductId());
  const price = Number(body.price) || 0;
  const categories = [].concat(body.categories || []).filter(Boolean);
  let images = existing && existing.images
    ? { large: existing.images.large, medium: existing.images.medium, small: existing.images.small, desc: existing.images.desc || [] }
    : { large: null, medium: null, small: null, desc: [] };
  if (file) {
    images = { large: file.filename, medium: file.filename, small: file.filename, desc: images.desc };
  }
  const options = [{ price, salePrice: price, discount: 0, mediumImage: images.medium, smallImage: images.small }];
  return {
    productId: id,
    name: (body.name || '').trim(),
    badge: (body.badge || '').trim(),
    price,
    options,
    categories,
    images,
    description: body.description || '',
  };
}

// --- 상품 등록 처리 ---
router.post('/products', upload.single('image'), (req, res) => {
  const product = buildProduct(req.body, req.file, null);
  if (!product.name) return res.status(400).send('상품명을 입력하세요.');
  store.upsert(product);
  res.redirect('/admin/products');
});

// --- 상품 수정 처리 ---
router.post('/products/:id', upload.single('image'), (req, res) => {
  const existing = store.get(req.params.id);
  if (!existing) return res.status(404).send('상품을 찾을 수 없습니다.');
  const product = buildProduct(req.body, req.file, existing);
  store.upsert(product);
  res.redirect('/admin/products');
});

// --- 가격만 빠른 수정 (목록 인라인) ---
router.post('/products/:id/price', (req, res) => {
  store.updatePrice(req.params.id, Number(req.body.price) || 0);
  res.redirect('back');
});

// --- 상품 삭제 ---
router.post('/products/:id/delete', (req, res) => {
  store.remove(req.params.id);
  res.redirect('back');
});

// --- 카테고리 목록 ---
router.get('/categories', (req, res) => {
  res.render('admin/categories', { title: '카테고리', categories: store.categoriesAll() });
});

module.exports = { router, SHOP_INFO };
