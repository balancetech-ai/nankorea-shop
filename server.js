'use strict';

const express = require('express');
const path = require('path');
const store = require('./store');
const { router: adminRouter, SHOP_INFO } = require('./admin');

const app = express();
const PORT = process.env.PORT || 3000;

// 블루샵 원본 쇼핑몰 ID (이미지 경로 키로 보존)
const SHOP_ID = 'S0000149';

// --- 뷰 엔진 ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 정적 파일 ---
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// 원본(classic) 스킨이 참조하는 블루샵 리소스(css/js/버튼이미지) 미러
app.use('/shop/resources', express.static(path.join(__dirname, 'assets', 'shop', 'resources')));

// --- 이미지 URL 헬퍼 (원본 파일명/경로 보존, 로컬 미러로 self-contained) ---
function imgProd(file) {
  return file ? `/assets/images/fs_prod/${SHOP_ID}/${file}` : null;
}
function imgProdDesc(file) {
  return file ? `/assets/images/fs_prod_desc/${SHOP_ID}/${file}` : null;
}
function imgShop(file) {
  return `/assets/images/fs_shop/${SHOP_ID}/${file}`;
}
function imgEvent(rel) {
  return `/assets/images/fs_event/${SHOP_ID}/${rel}`;
}
function imgCategory(id) {
  return `/assets/images/fs_category/${SHOP_ID}/${id}_sub.png`;
}

// --- 관리자 페이지 (쇼핑몰 라우트보다 먼저, UA 분기 영향 안 받게) ---
app.use('/admin', adminRouter);

// --- 모든 뷰 공용 로컬 변수 ---
app.use((req, res, next) => {
  res.locals.navCategories = store.navCategories();
  res.locals.usageCategories = store.purposeCategories();
  res.locals.imgProd = imgProd;
  res.locals.imgProdDesc = imgProdDesc;
  res.locals.imgShop = imgShop;
  res.locals.imgEvent = imgEvent;
  res.locals.imgCategory = imgCategory;
  res.locals.shop = SHOP_INFO;
  res.locals.fmtPrice = (n) => `${Number(n || 0).toLocaleString('ko-KR')}원`;
  res.locals.currentCategory = null;
  next();
});

// 상품 정렬 헬퍼 (원본 정렬바와 동일: 상품이름순 / 낮은가격순 / 높은가격순)
function sortProducts(arr, sort) {
  if (sort === 'low') arr.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === 'high') arr.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sort === 'name') arr.sort((a, b) => String(a.name).localeCompare(String(b.name), 'ko'));
  return arr;
}

// 카테고리 → 상품 목록 헬퍼
function productsOfCategory(categoryId) {
  const category = store.categoryById(categoryId);
  if (!category) return null;
  const list = (category.productIds || [])
    .map((pid) => store.get(pid))
    .filter(Boolean);
  return { category, list };
}

// 스킨별 라우트 등록 (classic = 원본 구조 / kurly = 신형 / mobile = 모바일)
function mountSkin(skin, base) {
  // 메인
  app.get(base || '/', (req, res) => {
    const all = store.list();
    res.render(`${skin}/index`, {
      title: '한국난원',
      featured: all.slice(0, 8), // 추천상품(큰2+작2)
      best: all.slice(8, 16),    // 베스트상품(큰2+작4)
      luxury: all.slice(16, 22), // 명품상품(큰2+작4)
      base: base || '',
    });
  });

  // 카테고리별 상품 목록 (?sort=name|low|high, ?min=&max=)
  app.get(`${base}/category/:id`, (req, res) => {
    const found = productsOfCategory(req.params.id);
    if (!found) return res.status(404).render(`${skin}/404`, { title: '카테고리 없음', base: base || '' });
    const sort = req.query.sort || '';
    const min = req.query.min ? Number(req.query.min) : null;
    const max = req.query.max ? Number(req.query.max) : null;
    let list = found.list.slice();
    if (min != null) list = list.filter((p) => (p.price || 0) >= min);
    if (max != null) list = list.filter((p) => (p.price || 0) <= max);
    list = sortProducts(list, sort);
    res.render(`${skin}/category`, {
      title: found.category.name,
      category: found.category,
      products: list,
      sort,
      min: req.query.min || '',
      max: req.query.max || '',
      currentCategory: found.category.id,
      base: base || '',
    });
  });

  // 상품명 검색
  app.get(`${base}/search`, (req, res) => {
    const q = (req.query.productName || req.query.q || '').trim();
    const sort = req.query.sort || '';
    const results = q ? sortProducts(store.list().filter((p) => p.name && p.name.includes(q)), sort) : [];
    res.render(`${skin}/search`, { title: q ? `'${q}' 검색결과` : '상품검색', q, products: results, sort, base: base || '' });
  });

  // 로그인 / 회원서비스 화면 (실제 인증은 3단계 블루마 DB 연동 시)
  app.get(`${base}/login`, (req, res) => {
    res.render(`${skin}/login`, { title: '로그인', base: base || '' });
  });

  // 상품 상세
  app.get(`${base}/product/:id`, (req, res) => {
    const product = store.get(req.params.id);
    if (!product) return res.status(404).render(`${skin}/404`, { title: '상품 없음', base: base || '' });
    const cat = (product.categories || []).map((id) => store.categoryById(id)).filter(Boolean)[0] || null;
    const related = (cat && cat.productIds ? cat.productIds : [])
      .map((pid) => store.get(pid))
      .filter((rp) => rp && rp.productId !== product.productId)
      .slice(0, 5);
    res.render(`${skin}/product`, {
      title: product.name, product, cat, related,
      currentCategory: cat ? cat.id : null, base: base || '',
    });
  });
}

// 모바일 UA 자동 분기 (?pc=1 이면 PC버전 고정 쿠키). /admin 은 위에서 이미 처리됨.
const MOBILE_UA = /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
app.use((req, res, next) => {
  if (req.query.pc === '1') {
    res.setHeader('Set-Cookie', 'forcePC=1; Path=/; Max-Age=86400');
    return next();
  }
  if (/(?:^|;\s*)forcePC=1/.test(req.headers.cookie || '')) return next();
  if (/^\/(m|new|shop|assets|css|admin)(\/|$)/.test(req.path)) return next();
  if (MOBILE_UA.test(req.headers['user-agent'] || '')) {
    const qs = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
    return res.redirect(302, '/m' + (req.path === '/' ? '' : req.path) + qs);
  }
  next();
});

// classic(원본 구조)=기본 / kurly(신형)=/new / mobile(모바일)=/m
mountSkin('classic', '');
mountSkin('kurly', '/new');
mountSkin('mobile', '/m');

// 404
app.use((req, res) => res.status(404).render('classic/404', { title: '페이지 없음', base: '' }));

app.listen(PORT, () => {
  console.log(`한국난원 쇼핑몰 → http://localhost:${PORT}`);
  console.log(`  · 원본 구조(classic): /`);
  console.log(`  · 신형 리디자인(kurly): /new`);
  console.log(`  · 모바일(mobile): /m  (모바일 UA 자동분기)`);
  console.log(`  · 관리자(admin): /admin`);
  console.log(`  상품 ${store.list().length}개 / 카테고리 ${store.categoriesAll().length}개 로드 완료`);
});
