# 한국난원 쇼핑몰(nankorea-shop) 작업기록

> 이 문서는 작업 연속성을 위한 기록입니다. **매 작업 세션마다 맨 아래 "작업 히스토리"에 날짜별로 이어서 기록**하세요.
> 최종 업데이트: 2026-06-14

---

## 1. 프로젝트 한 줄 요약

기존 한국난원 쇼핑몰 `nankorea.flowerteam.kr/shop`(블루샵 플랫폼, Spring 기반, 쇼핑몰ID `S0000149`)을
**원본 접근 없이 렌더된 HTML/CSS/이미지만 미러링**해 복제한 Node.js 쇼핑몰.
원본은 관리툴 미비·디자인 변경 불가라서, 복제 후 ① 다양한 디자인(스킨) 제공 ② 자체 관리자 또는 블루마 장부 DB 연동이 목표.

- 경로: `C:\Users\user\projects\nankorea-shop`
- GitHub: `balancetech-ai/nankorea-shop`
- 기술: Node.js + Express + EJS, 데이터는 JSON 파일(`data/*.json`)

---

## 2. 핵심 설계 (왜 이렇게 만들었나)

**데이터 / 골격 / 스킨 / 서버 4분리.**

| 층 | 무엇 | 위치 |
|----|------|------|
| 데이터 | 상품·카테고리 (HTML과 분리) | `data/products.json`, `data/categories.json` |
| 골격 | 화면 구조 (EJS 템플릿) | `views/<스킨>/` |
| 스킨 | 디자인 (CSS) | `css/` |
| 서버 | 라우팅·렌더 | `server.js`, `store.js`, `admin.js` |

**가장 중요한 전략:** 원본의 `productId`·`categoryId`·이미지 파일명을 **키로 그대로 보존**.
→ 나중에 블루마 DB 연동 시 "우리 필드 = 그쪽 컬럼" 1:1 매핑이 됨. (이게 후반 연동의 열쇠)

**왜 HTML을 직접 안 고치나:** 상품/가격을 바꿀 땐 HTML(틀)이 아니라 **데이터(JSON)** 만 바꾸면 화면이 자동 반영됨.
관리자 페이지가 이 데이터를 수정함.

---

## 3. 현재 완성된 것 (2026-06-14 기준)

### 3개 쇼핑몰 스킨 (같은 데이터·라우팅 공유)

| 스킨 | URL | 설명 |
|------|-----|------|
| **classic** (원본) | `/` | 블루샵과 동일한 구조. `style01.css`(원본 CSS) + sprite 이미지 사용 |
| **kurly** (신형) | `/new` | 마켓컬리풍 리디자인 (제미나이 초기본 기반) |
| **mobile** (모바일) | `/m` | 폰 전용. 모바일 UA 접속 시 자동 분기(302), `?pc=1`로 PC 고정 |

### 전용 관리자 페이지

| URL | 기능 |
|-----|------|
| `/admin` | 로그인(비번 = env `ADMIN_PASSWORD`, `.env` 참조), 대시보드, 상품 CRUD, 가격 즉시수정, 이미지 업로드, 카테고리 |

상품 변경은 `data/products.json`에 저장되어 **3개 스킨 모두에 즉시 반영**.

### 데이터 (블루마 DB에서 동기화됨 — 8번 참고)

- 상품 **238개** (`products.json`, productId 키 객체) ← `npm run sync`로 DB 활성상품 기준 갱신
- 카테고리 **17개** (`categories.json`): 상품분류 10개(`group:product`, X1폭포석·X2기타 포함) + 용도별 7개(`group:purpose`)
- 이미지 미러: fs_prod, fs_prod_desc, fs_category, fs_shop, fs_event (동기화 시 CDN에서 자동 보강)
- 블루샵 리소스(원본 CSS/JS/버튼 sprite): `assets/shop/resources/` (img 215개+)
- 동기화 전 백업: `data/_backup_<날짜>/`

---

## 4. 파일 구조

```
nankorea-shop/
├─ server.js              # 메인 서버. 스킨 라우팅(mountSkin), 모바일 UA 분기, 정적서빙
├─ store.js               # 데이터 단일 소유. JSON 읽기/쓰기, 카테고리 동기화
├─ admin.js               # 관리자 라우터(/admin). 인증·CRUD·이미지업로드(multer)
├─ .env                   # DB접속·관리자비번 (gitignore — 커밋 안 됨)
├─ package.json           # deps: express, ejs, multer, mysql2 / scripts: start, dev, sync
├─ data/
│  ├─ products.json       # 상품 238개 (productId 키 객체) ★DB동기화 결과물
│  ├─ categories.json     # 카테고리 17개
│  ├─ products-list.json  # 목록용 경량본(초기 스크래핑 산출물)
│  ├─ missing-images.json # 원본에도 없던 누락 이미지 기록
│  └─ _backup_<날짜>/      # sync 직전 자동 백업
├─ views/
│  ├─ classic/  (index, category, product, search, login, 404 + partials: header/footer/item)
│  ├─ kurly/    (동일 구성 + partials: header/footer/product-card)
│  ├─ mobile/   (동일 구성 + partials: header/footer/card)
│  └─ admin/    (login, dashboard, products, product-form, categories + partials: head/foot)
├─ css/
│  ├─ kurly.css   # 신형 스킨
│  ├─ shop.css    # 신형 보강
│  ├─ mobile.css  # 모바일 스킨
│  └─ admin.css   # 관리자
├─ assets/
│  ├─ images/  (fs_prod, fs_prod_desc, fs_category, fs_shop, fs_event)  # 상품·배너 이미지
│  └─ shop/resources/  (css/style01.css, js, img sprite)  # 원본 블루샵 리소스 미러
├─ scraper/
│  ├─ scrape-categories.mjs       # (초기) 웹 카테고리·상품목록 수집
│  ├─ scrape-details.mjs          # (초기) 상품 상세 수집
│  ├─ download-images.mjs         # (초기) 이미지 미러링
│  ├─ scrape-usage-categories.mjs # (초기) 용도별(201~207) 상품ID 보강
│  └─ sync-from-db.mjs            # ★블루마 DB→JSON 동기화 (npm run sync)
├─ reference/original/  (main.html, list.html, detail.html, login.html)  # 라이브 원본 HTML 스냅샷
├─ index.html, category.html      # 제미나이 초기본(보관용, 미사용)
└─ node_modules/ (.gitignore)
```

---

## 5. 실행 방법

```bash
cd C:\Users\user\projects\nankorea-shop
npm install        # 최초 1회
npm start          # node server.js → http://localhost:3000
npm run sync       # 블루마 DB에서 상품 최신화 (DB는 읽기만). 끝나면 서버 재시작 필요
```

- 원본: http://localhost:3000/
- 신형: http://localhost:3000/new
- 모바일: http://localhost:3000/m  (또는 PC에서 강제로 보려면 그냥 /m 접속)
- 관리자: http://localhost:3000/admin  (비번 = env `ADMIN_PASSWORD`, `.env` 참조)

환경변수 (`.env` 파일에 저장됨):
- `PORT` (기본 3000)
- `ADMIN_PASSWORD` (실제 값은 `.env` 참조 — **운영 전 변경 권장**)
- `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASS`/`DB_NAME` (블루마 DB, sync용)

---

## 6. 라우트 정리

### 쇼핑몰 (각 스킨, `<base>` = `''`/`/new`/`/m`)
- `GET <base>/` 메인 (추천 큰2+작2 / 베스트 큰2+작4 / 명품 큰2+작4)
- `GET <base>/category/:id` 카테고리 목록 (`?sort=name|low|high`, `?min=&max=` 가격대)
- `GET <base>/product/:id` 상품 상세
- `GET <base>/search?productName=` 검색
- `GET <base>/login` 로그인 화면(실제 인증은 미구현)

### 관리자 (`/admin`)
- `GET /admin/login`, `POST /admin/login`, `GET /admin/logout`
- `GET /admin` 대시보드
- `GET /admin/products` (`?q=&cat=&page=`) 목록
- `GET /admin/products/new`, `POST /admin/products` 등록
- `GET /admin/products/:id/edit`, `POST /admin/products/:id` 수정
- `POST /admin/products/:id/price` 가격만 수정
- `POST /admin/products/:id/delete` 삭제  ← **삭제/가격은 POST 필수(GET하면 404)**
- `GET /admin/categories` 카테고리 목록

---

## 7. 데이터 모델

**products.json** = `{ "productId": {상품}, ... }` (배열 아님! Object.values로 배열화)
```json
"27745": {
  "productId": "27745",
  "name": "수서해당",
  "badge": "분재",
  "price": 150000,
  "options": [{ "price":150000, "salePrice":150000, "discount":0, "mediumImage":"27745_2_M.jpg", "smallImage":"27745_2_S.jpg" }],
  "categories": ["109"],
  "images": { "large":"27745_2_L.jpg", "medium":"27745_2_M.jpg", "small":"27745_2_S.jpg", "desc":[] },
  "description": ""
}
```

**categories.json** = 배열
```json
{ "id":"103", "name":"동양란", "group":"product", "count":50, "productIds":["050050", ...] }
```
- `group`: `product`(상품분류: 동양란103·서양란104·근조화환101·축하화환102·꽃바구니105·관엽식물107·공기정화108·분재109 + DB추가분 X1폭포석·X2기타) / `purpose`(용도별 7개: 201~207)
- 웹ID(103 등)는 DB 내부분류ID(05 등)와 다름 → sync가 **이름으로 매핑**해 웹ID·배너이미지 유지 (8번 참고)
- 이미지 경로: `/assets/images/fs_prod/S0000149/{파일명}` (헬퍼 `imgProd()` 등이 생성)

---

## 8. 블루마 DB 연동 (✅ 읽기전용 동기화 완료)

**접속 정보** (`.env`에 저장, gitignore됨 — 커밋 안 됨):
- host / port / db `floweropdb` / user — **실제 접속정보는 `.env` 참조**(gitignore). 사장님이 준 호스트엔 오타가 있었음(`...m.me`→정상 도메인).
- 서버: **MySQL 8.4.4**. (초기 막혔던 mysql_native_password 인증문제는 DB관리자가 해결함)

**중요: 이건 한국난원 전용 DB가 아니라 블루마 플랫폼 전체 DB** (165 테이블, 꽃집 11,704개 공용). 우리는 `SHOP_ID='S0000149'` 슬라이스.

**DB → 우리 JSON 매핑** (productId/categoryId/이미지 키 보존 전략이 맞아떨어짐):
| DB 테이블 | 우리 필드 |
|-----------|-----------|
| `PD_PRODUCT` (PRODUCT_ID, PRODUCT_NAME, CATEGORY_ID, USE_YN, PRODUCT_TYPE) | productId/name/category |
| `PD_PRODUCT_PRICE` (PRICE, MAIN_YN, *_IMAGE_URI) | price/options/images |
| `PD_PRODUCT_CATEGORY` (CATEGORY_ID, CATEGORY_NAME) | categories |
| `PD_PRODUCT_DESC` / `PD_PRODUCT_DESC_IMAGE` | description / images.desc |
| `FS_FLOWER_SHOP` (SHOP_ID, COMPANY_NAME, …) | 화원정보 |

**동기화 방식 = 읽기전용 (사장님 선택).** `scraper/sync-from-db.mjs`:
- **실행: `npm run sync`** (`.env` 자동로드). DB는 SELECT만, 절대 안 건드림.
- 활성상품(USE_YN=1, PRODUCT_TYPE='1', 옵션상품 제외) **238개**를 data/*.json 으로 생성, 없는 이미지는 CDN(`resource.flowerteam.kr`)에서 받음.
- **주의: 카테고리 ID 체계가 둘이다.** DB 내부분류(`05`동양란…)는 웹사이트 진열분류(`103`동양란…)와 ID가 다름 → **이름으로 매핑**해 우리 웹ID(101~111, 배너이미지 키) 유지. DB에만 있는 분류는 `X1`(폭포석)·`X2`(기타) 새로 추가. **용도별(201~207)은 DB에 없어서 기존 스크랩본 보존**(활성상품으로 필터).
- **이미지 경로 함정:** 상품이미지가 `fs_prod/S0000149/`만이 아니라 `fs_prod/basic/`(공용 재고이미지)에도 있음 → DB의 전체 URI로 받아 우리 `fs_prod/S0000149/<파일명>`으로 정규화 저장.

**현재 카탈로그:** 상품 238개 / 카테고리 17개(상품분류 10 + 용도별 7). 동기화 전 데이터는 `data/_backup_<날짜>/`에 백업됨.

**⚠️ 동기화 vs 관리자 관계:** `npm run sync`는 data/*.json을 **덮어씀**. 따라서 자체 관리자(/admin)에서 한 수정은 다음 sync 때 사라짐. 현재 모델 = **DB가 마스터, 우리는 읽기만**. (관리자에서 DB로 쓰기(write-back)는 공용 운영DB라 보류 — 추후 명확한 허가 시 검토.)

**다음 후보:** 자동 동기화(주기 실행), DB 실시간 읽기(store.js를 DB버전으로), 또는 관리자 write-back(위험, 허가 필요).

---

## 9. 꼭 기억할 함정/교훈

- **products.json은 배열이 아니라 productId 키 객체** → `Object.values()`로 배열화.
- **카테고리 group 값은 `purpose`** (`usage` 아님!). 처음에 오인해 용도별 메뉴가 비어 있었음.
- **원본 상세 페이지 섹션 클래스는 `section.goodsinfo`** (productView 아님). 틀리면 상세 레이아웃 전체가 깨짐.
- **목록 베스트는 `largepd4`, 정렬바는 `nav>h3>ul` + sprite**, 카테고리 비주얼은 `{id}_sub.png`.
- **메인 쇼케이스 칸수 고정:** 추천 smallPd=2개, 베스트/명품 smallpd4=각 4개. 명품 섹션은 `banner02`+`pdgood01/02`.
- **style01.css는 sprite 배경이미지 187개에 의존** → 누락 시 메뉴/버튼 깨짐. 모두 받아둠.
- **Git Bash(Windows)는 한글을 CP949로 보냄** → curl 테스트 시 한글 깨짐. 서버 버그 아님(브라우저는 UTF-8 정상). 테스트는 node fetch+URLSearchParams로.
- **관리자 삭제/가격수정은 POST**. GET으로 호출하면 404.
- 원본 사이트는 라이브 접근 가능 → 추가 원본 페이지/이미지 필요 시 재수집 가능.

---

## 10. 다음 후보 작업

1. **DB 동기화 자동화** — 주기 실행(매일/매주)으로 상품 변경 자동 반영. 또는 store.js를 DB 실시간 읽기로 전환.
2. **관리자 write-back 검토** — 관리자 수정을 블루마 실DB에 반영 (공용 운영DB라 위험, 명확한 허가 필요. 현재는 sync가 관리자 수정을 덮어씀)
3. 미세 디자인 다듬기 (메인 추천/베스트 영역 간격 등 — CSS만 조정, 구조 영향 없음)
4. 관리자 보강 — 상세설명 이미지 여러 장 업로드, 비밀번호 변경 UI
5. 실제 배포 (Cloud Run 등, 다른 프로젝트와 동일 스택)
6. 미구현(주문계열): 실제 로그인 인증·장바구니·주문·결제·회원가입·주문조회 (블루마 주문 테이블 SO_* 연동 필요)

---

## 11. 작업 히스토리 (세션별로 이어서 기록)

### 2026-06-14
- **1단계(이전 세션):** 스크래퍼로 상품181·카테고리16·이미지 미러링 완료.
- **2단계:** Express+EJS로 신형(kurly) 스킨 구축 — 메인/목록/상세, products.json 연동. (`server.js`, `views/kurly/`, `css/shop.css`)
- **2단계-b:** "원본과 동일한 구조 필요" → classic 스킨 추가. 라이브 원본 HTML(`reference/original/`) 보고 복제, `style01.css`+sprite 187개 다운로드, 회사정보 하드코딩. 두 스킨 체제(`mountSkin`)로 재편.
- **원본 완성:** 용도별 카테고리(201~207) 데이터 보강, 정렬·검색·로그인화면 구현.
- **디자인 정밀수정:** 라이브와 스크린샷 1:1 비교 → 상세 `section.goodsinfo`, 목록 `largepd4`/카테고리배너/정렬바, 메인 쇼케이스 칸수, 명품 섹션 누락 등 수정.
- **모바일 스킨:** `views/mobile/` + `css/mobile.css` + UA 자동분기 미들웨어.
- **전용 관리자 페이지:** `store.js`(데이터 모듈) + `admin.js`(라우터) + `views/admin/` + `css/admin.css`. 상품 CRUD·가격수정·이미지업로드·카테고리. multer 추가. 로그인·등록·수정·삭제 검증 완료.
- **블루마 DB 연동 시도:** mysql2 설치, 접속 시도 → MySQL 8.4.4 인증 플러그인 문제로 막힘(위 8번). DB 관리자 조치 대기 중.

### 2026-06-14 (이어서) — 블루마 DB 연동
- DB 접속정보 수령 → 호스트 도메인 오타 및 MySQL 8.4 인증플러그인 문제 진단, DB관리자가 해결.
- 읽기전용 접속 성공. 165테이블 플랫폼 DB임을 파악, 우리 화원(S0000149) 상품/카테고리/가격/설명 테이블 매핑 확인(JSON과 1:1).
- 사장님이 **읽기전용 동기화** 방향 선택.
- `scraper/sync-from-db.mjs` 작성 → `npm run sync`로 활성 238개 상품 + 카테고리 17개 동기화, 이미지 195개 신규 다운로드(실패 0). 기존 데이터는 `data/_backup_*`에 백업.
- 옵션상품 제외, `fs_prod/basic/` 경로 이미지 처리, 카테고리 이름매핑(웹ID 유지) 등 보정 완료.
- `.env`(gitignore) + `npm run sync` 한 줄 워크플로우 구축.

### 2026-06-14 (이어서) — 로컬 블루마 테스트 DB 셋업
- **목적:** 쇼핑몰을 기존 방식대로 재창조하면서 **DB 연동 부분만** 개발하려고, 공용 운영DB를 안 건드리는 **로컬 테스트 DB**를 내 PC에 구축. "원본과 동일한 구조로".
- **엔진:** 원본과 동일한 **MySQL 8.4.4 포터블(ZIP)**. Docker Desktop은 startup 크래시(Inference manager 파일락 버그)로 포기하고 네이티브로 전환. 시스템에 설치 안 함.
- **위치:** `C:\Users\user\mysql-test\` (포터블 추출 + 데이터디렉터리 + my.ini + sql 덤프 + tools 스크립트)
- **접속:** `127.0.0.1:3307` / DB `floweropdb` / 계정 `root`(비번없음) 또는 원본과 동일한 운영계정(실제 ID/PW는 `.env` 참조, floweropdb 풀권한).
- **구조:** 원본 floweropdb의 **165개 전부**(162 테이블 + 3 뷰) 복제. node+mysql2로 `SHOW CREATE TABLE` 떠서 `sql/schema.sql` 생성(mysqldump 불필요). 우편번호 뷰 3개가 참조하는 외부 `postdb`는 권한없어 뷰 컬럼 기준 스텁(`sql/postdb-stub.sql`)으로 생성해 구조 완성.
- **데이터:** 사장님이 "상품 데이터만" 요청 → **상품 도메인만 시딩**(PD_PRODUCT 671/PRICE 1061/CATEGORY 15/DESC 437/DESC_IMAGE 457, PD_SERVICE_PRODUCT* , FS_FLOWER_SHOP 1 = 3,308행). 주문/결제/고객/로그인 등 PII 대용량 테이블은 **구조만, 비어있음**. 활성상품 238개로 운영 sync 결과와 일치 검증.
- **함정:** ① Windows MySQL은 `lower_case_table_names=1`(테이블명 비구분)이라 앱의 `PD_PRODUCT` 대문자 쿼리 그대로 동작. ② 원본 데이터에 `0000-00-00` 기본값 있어 적재 시 `SET sql_mode=''` 필요(strict 끄기). ③ `skip-name-resolve` 켜면 `root@localhost`가 TCP 127.0.0.1과 매칭 안 됨 → 끔.
- **덤프 툴:** `mysql-test/tools/dump-schema.mjs`(구조), `dump-products.mjs`(상품데이터), `dump-data.mjs`(전체 슬라이스). 원본은 전부 **SELECT만**, 절대 안 건드림.
- **서버 켜기(재부팅 후):** `C:\Users\user\mysql-test\mysql-8.4.4-winx64\bin\mysqld.exe --defaults-file=C:\Users\user\mysql-test\my.ini --console`
- **로컬로 sync 돌리기:** 실DB `.env`는 그대로 두고 셸에서 `$env:DB_HOST="127.0.0.1"; $env:DB_PORT="3307"; npm run sync` (sync 스크립트가 기존 env 우선).
- **다음:** 이 로컬 DB에 INSERT/UPDATE 하며 DB연동(쓰기/실시간읽기) 개발.

### 2026-06-14 (이어서) — 3개 스킨 화면 점검 & 자투리 발견
- 브라우저로 classic(`/`)·kurly(`/new`)·mobile(`/m`) 메인 렌더 확인. 페이지 이동(메뉴→카테고리, 상품→상세) 정상.
- **혼동 메모:** 메인(`/`)은 classic(원본 블루샵)이고 kurly는 `/new`. 루트의 정적 `index.html`/`category.html`은 제미나이 초기본(마켓컬리풍)이라 그걸 보고 "인덱스가 컬리"로 오해하기 쉬움. 홈은 서버가 `views/classic/index.ejs`로 생성 — 정적 index.html과 무관.
- **다음 할 일 (이번 세션에 발견, 미처리):**
  1. **classic 상세 수량→실구매액 JS 누락** — `views/classic/product.ejs`에 `#txt_orderQuantity` select와 `#totalAmt` span은 있으나 연결 스크립트가 없어 수량 바꿔도 금액 안 바뀜. **DB 무관 순수 프론트** → 바로 구현 가능(선택 가격옵션 라디오 × 수량). kurly/mobile 상세도 동일 점검 필요.
  2. **주문/장바구니 버튼** = 의도된 미구현(3단계 DB연동). 최소 "준비중(3단계 예정)" 안내라도 붙이면 UX 개선.
  3. **루트 죽은 파일 삭제** — `index.html`, `category.html`(서버가 서빙/참조 안 함, 제미나이 초기본). 단 `css/kurly.css`·`css/shop.css`는 kurly 스킨이 쓰므로 **보존**. 파일구조 설명(4번)도 같이 정리.
- 사장님이 여기서 nankorea-shop은 일단 멈추고 다른 프로젝트로 전환.

### 2026-06-17 — 자투리 3건 마무리 (지난 세션 미처리분)
- **① 상세 수량/옵션 → 실구매액 JS 구현(DB 무관 순수 프론트):**
  - classic `product.ejs`: 가격옵션 라디오에 `value`/`data-price` 부여 + 스크립트 추가 → (선택 라디오 가격 × 주문수량)으로 `#totalAmt` 실시간 갱신. (`#txt_orderQuantity` select 변경/라디오 변경 시 재계산)
  - kurly `product.ejs`: 옵션 `select`에 `id="dOptions"`+`data-price`, 가격 `div`에 `id="dPrice"` → 옵션 변경 시 표시가격 갱신. 출력형식은 헬퍼 `fmtPrice`(`N원`)와 일치.
  - mobile: 수량 UI 없는 단순구조라 변경 불필요(원래대로).
- **② 주문/장바구니 버튼 "3단계(DB 연동) 준비중" 안내:**
  - classic: `btn_order`/`btn_cart` 앵커에 `onclick` alert + `return false`.
  - kurly: `.btn-cart`/`.btn-buy`를 `type="button"`으로 고정 + `onclick` alert.
  - mobile: 이미 안내 alert 있었음(유지).
- **③ 루트 죽은 파일 삭제:** `index.html`, `category.html`(제미나이 초기본, 서버가 서빙/참조 안 함 — `express.static`은 `/css`·`/assets`·`/shop/resources`만, grep으로 무참조 확인) 제거. `css/kurly.css`·`css/shop.css`는 kurly 스킨이 쓰므로 보존.
- **검증:** `node server.js` 후 단일/다중옵션 상품으로 classic·kurly 상세 렌더 확인(`data-price`, `totalAmt`, `dOptions`, 3단계 안내 모두 출력).

### 2026-06-17 — ⚠️ git 원격 갈라짐 발견 & 브랜치 분리
- **중요 발견:** GitHub `origin/main`은 이 로컬 프로젝트와 **완전히 다른 버전**임. 원격 main = 6개 파일(정적 `index.html`·`category.html`(제미나이 초기본) + `Dockerfile`·`nginx.conf`)로, **Cloud Run에 정적 사이트로 배포된 별개 줄기**로 추정. 로컬 = 풀 Express/EJS 미러(이 WORKLOG가 말하는 진짜 프로젝트, 62파일).
- 두 줄기가 초기커밋 이후 갈라져 fast-forward 불가. 강제푸시하면 원격 배포설정/정적사이트가 깨질 위험 → **하지 않음**.
- **결정(사장님):** 이번 코드를 `main`이 아니라 **`feature/express-app` 브랜치로 푸시**(origin에 올림). 원격 main(라이브 정적사이트 가능)은 그대로 보존. 통합은 추후 PR로.
- ⚠️ **주의:** 이번 세션에서 로컬 `index.html`·`category.html`을 "죽은 파일"로 삭제했는데, **원격 main은 그 정적파일을 nginx로 실제 배포에 사용 중일 수 있음**. 두 줄기를 합칠 땐 이 점 고려.
- 보안: WORKLOG의 실제 DB/관리자 자격증명을 `.env 참조`로 마스킹 후 커밋(평문 비번이 GitHub에 안 올라가게). 미해결: 관리자 기본비번이 `admin.js` fallback + `views/admin/login.ejs` 힌트로 **브라우저에 노출**됨 — 운영 전 제거 권장(별개 하드닝 이슈).

### 2026-06-17 (이어서) — 외관 복제 완성도 점검 & 보강
원본 스냅샷(`reference/original/*.html`)과 렌더 결과를 구조 비교(클래스/리소스 diff)해 누락 발견·보강. 검증: 페이지별 참조 리소스 199개 전수 GET → 깨짐 0(아래 favicon 1건도 해결).
- **① 카테고리 페이지네이션 누락 → 구현 (가장 큰 외관 차이):** 원본은 **20개/페이지**(동양란 75 → 4페이지)인데 클론은 전체를 한 화면에 쏟아냄. `server.js` category 라우트에 `?page` + 20개 슬라이스 + `total/page/totalPages` 전달(베스트4는 전체기준 별도 `best`로). 3스킨 모두 페이지네이션 UI 추가: classic `.paging`(원본 마크업 `strong.orange` 재현 + 인라인 스타일), kurly `.k-paging`(컬리 퍼플), mobile `.m-paging`. 카운트표시는 page수→`total`로 정정. page 초과 시 마지막 페이지로 클램프, 소형 카테고리(≤20)는 paging 숨김.
- **② 로그인 페이지 좌측 메뉴/디자인 통째 누락 → 복원:** 원본 로그인은 `section.memberjoinagree > section.mypage > (좌측 nav.csnav 고객만족센터 + 우측 div.memjoincontent)` 2단 구조. **로그인 폼 스타일(`logleftwrap`/`logrightwrap`/`conlogin` 배너 sprite)이 전부 `section.memberjoinagree` 하위 선택자에 묶여 있어서, 래퍼가 없던 기존 클론은 폼이 사실상 무스타일로 렌더됐음.** `views/classic/login.ejs`에 래퍼 2겹 + `nav.csnav`(cc01~07) 추가 → 원본 디자인/좌측 고객센터 메뉴 복원. 관련 sprite(visuallogin/tt_mylogin01/tt_myloginbg/menu_customertop) 존재 확인.
- **③ favicon 404 → 해결:** 미러 누락된 favicon을 원본(`nankorea.flowerteam.kr/shop/favicon.ico`)에서 받아 `assets/shop/resources/img/favicon.ico`로 저장.
- **확인된 양호 항목:** 메인(추천/베스트/명품 쇼케이스·키비주얼·이벤트·푸터)·상세(`goodsinfo` 레이아웃)는 원본과 구조 일치. 푸터 `bizShopLink`(기업용 쇼핑몰 배너)만 의도적 생략(선택사항).
- ⚠️ **메모(미해결, 별개):** `assets/`는 gitignore라 **블루샵 리소스(style01.css·sprite 187개·favicon)는 git에 없음**. 이건 `npm run sync`로 재생성 안 됨(sync는 상품/카테고리 이미지만). 배포/클론 시 `assets/`를 별도로 동기화해야 외관이 안 깨짐. (이전 메모의 "sync로 재생성" 설명은 상품이미지에 한함.)

### 2026-06-17 (이어서) — 🐛 상단/퀵메뉴 레이아웃 어긋남 근본원인 수정 (reset.css 누락)
브라우저로 메인을 보던 중 사장님이 발견: ① 상단 유틸탭 "이용안내"가 두 겹으로 보이고 ② 즐겨찾기 탭이 잘리고 ③ 우측 QUICK MENU 아래 항목 박스가 퀵메뉴 박스와 어긋남.
- **진단(DOM 측정):** `nav.topmenuleft ul`은 left:2인데 첫 탭 `d01 a`는 left:42 — **40px 어긋남**. 원인은 브라우저 기본 `<ul>` padding-left(40px)가 리셋 안 됨. ul 배경 스프라이트(left:2)와 실제 탭(left:42)이 겹쳐 "이용안내 두 겹"·전체 우측 밀림→즐겨찾기 잘림. 퀵메뉴 항목도 동일하게 40px 밀림.
- **근본원인:** `style01.css` 2번째 줄 `@import url( reset.css );`(+ `jquery-ui-1.8.4.custom.css`)가 **미러링 안 됨(404)**. 전체 레이아웃이 이 리셋(ul/ol 패딩0·list-style none 등, Eric Meyer HTML5 reset)에 의존하는데 빠져서 모든 리스트가 밀려 있었음.
- **수정:** 원본에서 `reset.css`(26KB)·`jquery-ui-1.8.4.custom.css`(34KB) 받아 `assets/shop/resources/css/`에 저장. 재측정 결과 d01 left:2→정렬, d02 86, d03 163, 퀵메뉴 항목 ul left:1011=퀵메뉴 박스 left:1011 **정확히 일치**. 상단 탭 시각 확인도 "이용안내|전화주문안내|즐겨찾기" 깔끔.
- **gitignore 정책 수정:** 기존 `assets/`(전체 제외)는 외관 필수인 블루샵 리소스(css/js/sprite 3.1MB, sync로 재생성 안 됨)까지 날려 클론 시 외관이 깨졌음. → **`assets/images/`(상품이미지 131MB, sync로 재생성)만 제외**하고 `assets/shop/resources/`(216 sprite + reset/style01/jquery-ui css + js, favicon)는 **git 트래킹**으로 변경. 이제 저장소만 클론해도 외관이 살아남(상품이미지만 sync 필요). 이전 세션의 "에셋 전체 제외/ sync로 재생성" 메모는 이걸로 정정됨.

### 2026-06-17 (이어서) — 퀵메뉴 스크롤추적 + 푸터 계좌 레이아웃 수정
사장님 지적 2건:
- **① 퀵메뉴가 스크롤 따라 안 움직임(고정):** 원본은 `script.js`의 `initializequick('quickMenu','1010','85')`로 스크롤 시 부드럽게 따라옴. 클론은 그 스크립트를 안 불러 CSS `top:210px` 고정 상태였음. script.js 전체는 datepicker·lazyload·jcarousel 등 플러그인 의존이라 통째로 못 넣음 → **initializequick 로직만 자체포함 인라인 스크립트**로 `views/classic/partials/footer.ejs` 끝에 추가(left 1010, viewstart 85, viewscroll 30, 10ms 틱 트레일링). position:absolute라 가운데정렬 레이아웃에서도 콘텐츠 우측에 붙어 세로로만 따라옴. (검증: 스크롤 내리면 top 85→증가하며 추적. 백그라운드 탭은 setTimeout throttle로 느리지만 포커스 시 정상.)
- **② 푸터 계좌 3개·세로 → 2개·가로:** 라이브 원본 footer 엔드포인트(`/shop/ws/main/footer`) 조회 결과, 계좌 7개 중 **무통장(type 02)은 2개뿐**(068-02-060073 NH농협 한국난원 / 096-25-0012-675 국민은행 박창규). 클론은 신한(원본 type 01, 미표시)을 잘못 포함 + 1개씩 세로 `<tr>`로 깔았음. → `admin.js` SHOP_INFO.accounts를 2개로 정정, `footer.ejs` 계좌표를 **원본대로 2개/행 가로 정렬**(한 `<tr>`에 th·td·th·td)로 변경. 시각 확인 완료.

### (다음 세션은 여기에 이어서 작성)
-
