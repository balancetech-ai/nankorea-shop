# 한국난원 쇼핑몰 (nankorea-shop)

기존 한국난원 쇼핑몰(`nankorea.flowerteam.kr/shop`, 블루샵 플랫폼, 쇼핑몰ID `S0000149`)을
**원본 접근 없이 렌더된 HTML/CSS/이미지만 미러링**해 복제한 Node.js 쇼핑몰입니다.
원본 디자인을 그대로 살린 `classic` 스킨 + 리디자인(`kurly`) + 모바일(`mobile`) + 자체 관리자(`/admin`)를 제공합니다.

> **개발 연속성 문서는 [`WORKLOG.md`](./WORKLOG.md) 입니다.** 설계 의도·함정·작업 히스토리가 전부 거기 있으니 먼저 읽어주세요.

---

## ⚠️ 인수 시 먼저 확인할 3가지

1. **브랜치**: 실제 프로젝트는 **`feature/express-app`** 브랜치입니다.
   `main` 브랜치는 별개의 옛 정적 프로토타입(파일 6개 + Cloud Run 배포설정)이니 혼동 주의.
   ```bash
   git clone https://github.com/balancetech-ai/nankorea-shop.git
   cd nankorea-shop
   git checkout feature/express-app
   ```
2. **`.env`** (git 미포함): DB 접속정보·관리자 비밀번호. `.env.example` 복사 후 운영자에게 실제 값 수령.
3. **`assets/images/`** (git 미포함, 약 131MB): 상품/배너 이미지. 별도 전달받거나 `npm run sync`로 재생성.
   (블루샵 원본 리소스 `assets/shop/resources/` 의 CSS/스프라이트는 git에 포함되어 있음)

---

## 실행 방법

```bash
npm install            # 의존성 설치 (express, ejs, multer, mysql2)
cp .env.example .env   # 환경변수 템플릿 복사 후 값 채우기
npm start              # node server.js → http://localhost:3000
```

- 원본 스킨(classic): http://localhost:3000/
- 리디자인(kurly): http://localhost:3000/new
- 모바일(mobile): http://localhost:3000/m  (모바일 UA 자동분기)
- 관리자(admin): http://localhost:3000/admin

서버 구동만 할 거면 DB 없이도 동작합니다(데이터는 `data/*.json` 사용). DB는 동기화 시에만 필요.

```bash
npm run sync           # 라이브/DB 기준으로 상품 데이터 최신화 (아래 참고)
```

---

## 구조 (데이터 / 골격 / 스킨 / 서버 4분리)

| 층 | 내용 | 위치 |
|----|------|------|
| 데이터 | 상품·카테고리(JSON) | `data/products.json`, `data/categories.json` |
| 골격 | 화면 구조(EJS) | `views/<스킨>/` (classic·kurly·mobile·admin) |
| 스킨 | 디자인(CSS) | `css/`, classic은 `assets/shop/resources/css/style01.css` |
| 서버 | 라우팅·렌더 | `server.js`, `store.js`, `admin.js` |

- **`products.json` 은 배열이 아니라 `{ productId: {...} }` 객체** (`Object.values()`로 배열화).
- 상품/가격 변경은 HTML이 아니라 **데이터(JSON)** 만 바꾸면 3개 스킨에 자동 반영. 관리자(`/admin`)가 이 데이터를 수정.
- 원본 `productId`·`categoryId`·이미지 파일명을 **키로 보존** → 추후 DB 연동 시 1:1 매핑.

## 데이터 동기화 (`npm run sync`)

- `scraper/sync-from-db.mjs` 가 블루마 DB(읽기전용)에서 상품을 받아 `data/*.json` 을 **덮어씁니다**.
- 현재 카탈로그는 **라이브 쇼핑몰 기준 181개**로 맞춰져 있습니다(`scraper/match-live-catalog.mjs`, `scraper/scrape-order.mjs` 참고 — 라이브 진열순서/갯수까지 일치).
- ⚠️ sync는 data를 덮어쓰므로 관리자에서 한 수정은 다음 sync 때 사라집니다. **현재 모델 = DB가 마스터, 우리는 읽기만.**

## 기술 스택

Node.js + Express + EJS / 데이터는 JSON 파일 / 이미지 동기화에 mysql2. 빌드 단계 없음(정적 자산 직접 서빙).
