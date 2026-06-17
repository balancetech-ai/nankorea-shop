// 한국난원(블루샵 S0000149) 이미지 일괄 다운로드
// products.json + 카테고리 + 사이트 크롬(로고/배너/리소스) 이미지를 로컬 assets/로 미러링한다.
// 원본 파일명/경로 구조를 그대로 유지 → 후에 DB의 파일명과 1:1 매칭.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS = join(ROOT, "assets");
const BASE = "https://nankorea.flowerteam.kr";
const CDN = "https://resource.flowerteam.kr/images";
const SHOP = "S0000149";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function exists(p) { try { await access(p); return true; } catch { return false; } }

async function download(url, destPath) {
  if (await exists(destPath)) return "skip";
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return res.status; // 404 등
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, buf);
  return "ok";
}

function harvestUrls(html) {
  const urls = new Set();
  // CDN 이미지 (fs_shop/fs_category/fs_prod 등)
  for (const m of html.matchAll(/https:\/\/resource\.flowerteam\.kr\/images\/([^\s"')]+\.(?:png|jpg|jpeg|gif))/gi)) {
    urls.add("CDN:" + m[1]);
  }
  // 사이트 정적 리소스 (/shop/resources/...)
  for (const m of html.matchAll(/\/shop\/resources\/[^\s"')]+\.(?:png|jpg|jpeg|gif|css|js|ico)/gi)) {
    urls.add("RES:" + m[0]);
  }
  return urls;
}

async function main() {
  const products = JSON.parse(await readFile(join(ROOT, "data", "products.json"), "utf-8"));
  const categories = JSON.parse(await readFile(join(ROOT, "data", "categories.json"), "utf-8"));

  // 1) 상품 이미지 (fs_prod) + 설명 이미지 (fs_prod_desc)
  const cdnFiles = new Set();   // "fs_prod/S0000149/xxx.png" 형식 상대경로
  for (const p of Object.values(products)) {
    const im = p.images || {};
    for (const f of [im.large, im.medium, im.small]) if (f) cdnFiles.add(`fs_prod/${SHOP}/${f}`);
    for (const o of p.options || []) {
      if (o.mediumImage) cdnFiles.add(`fs_prod/${SHOP}/${o.mediumImage}`);
      if (o.smallImage) cdnFiles.add(`fs_prod/${SHOP}/${o.smallImage}`);
    }
    for (const f of im.desc || []) cdnFiles.add(`fs_prod_desc/${SHOP}/${f}`);
  }

  // 2) 카테고리 sub 이미지
  for (const c of categories) cdnFiles.add(`fs_category/${SHOP}/${c.id}_sub.png`);

  // 3) 사이트 크롬: 메인/로그인/상세 한 장에서 로고·배너·리소스 수집
  const resFiles = new Set();
  for (const path of ["/shop/main", "/shop/login", "/shop/customerCenter/information"]) {
    try {
      const html = await (await fetch(BASE + path, { headers: { "User-Agent": UA } })).text();
      for (const u of harvestUrls(html)) {
        if (u.startsWith("CDN:")) cdnFiles.add(u.slice(4));
        else resFiles.add(u.slice(4));
      }
    } catch { /* ignore */ }
  }

  let ok = 0, skip = 0, miss = 0;
  const missing = [];

  // CDN 이미지 다운로드
  const cdnList = [...cdnFiles];
  for (let i = 0; i < cdnList.length; i++) {
    const rel = cdnList[i];
    const r = await download(`${CDN}/${rel}`, join(ASSETS, "images", rel));
    if (r === "ok") ok++; else if (r === "skip") skip++; else { miss++; missing.push(rel + " (" + r + ")"); }
    if ((i + 1) % 50 === 0 || i === cdnList.length - 1)
      process.stdout.write(`\r  CDN ${i + 1}/${cdnList.length} (ok ${ok}, skip ${skip}, 404 ${miss})   `);
  }
  console.log("");

  // 사이트 리소스 다운로드 (/shop/resources/... → assets/shop/resources/...)
  const resList = [...resFiles];
  for (let i = 0; i < resList.length; i++) {
    const path = resList[i]; // /shop/resources/...
    const r = await download(BASE + path, join(ASSETS, path.replace(/^\//, "")));
    if (r === "ok") ok++; else if (r === "skip") skip++; else { miss++; missing.push(path + " (" + r + ")"); }
  }
  console.log(`  RES ${resList.length}개 처리`);

  await writeFile(join(ROOT, "data", "missing-images.json"), JSON.stringify(missing, null, 2), "utf-8");
  console.log(`\n완료: 다운로드 ${ok}, 건너뜀 ${skip}, 누락(404) ${miss}`);
  console.log(`  CDN 대상 ${cdnList.length} + 리소스 ${resList.length}`);
  if (miss) console.log(`  누락 목록 → data/missing-images.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
