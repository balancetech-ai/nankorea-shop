// 한국난원(블루샵 S0000149) 상품 상세 스크래퍼
// products-list.json의 전 상품에 대해 productDetail 페이지를 받아
// 가격옵션 / 설명텍스트 / 설명이미지 / 정식이미지(L,M,S)를 추출한다.
// 결과: data/products.json  (원본 productId가 키 = 블루마 DB 1:1 매칭의 기준)
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BASE = "https://nankorea.flowerteam.kr";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

function parseDetail(html, id) {
  // 상품명
  const nameMatch = html.match(/<div class="produtName">\s*<h2>([\s\S]*?)<\/h2>/);
  const name = nameMatch ? decodeEntities(nameMatch[1].trim()) : null;

  // 뱃지 (| 베스트 등)
  const badgeMatch = html.match(/<div class="produtName">[\s\S]*?<h3>\s*\|?\s*([\s\S]*?)<\/h3>/);
  const badge = badgeMatch ? decodeEntities(badgeMatch[1].trim()) : null;

  // 가격옵션: radio value="price|salePrice|discount|mediumUrl|smallRel|"
  const options = [];
  const radioRe = /name="rd_productPrice"\s+value="([^"]*)"/g;
  let rm;
  while ((rm = radioRe.exec(html)) !== null) {
    const parts = rm[1].split("|");
    options.push({
      price: Number(parts[0]) || null,
      salePrice: Number(parts[1]) || null,
      discount: Number(parts[2]) || 0,
      mediumImage: parts[3] ? parts[3].split("/").pop() : null,
      smallImage: parts[4] ? parts[4].split("/").pop() : null,
    });
  }

  // 대표 이미지 (hidden inputs)
  const largeImg = (html.match(/name=largeImage value="[^"]*\/([^/"]+)"/) || [])[1] || null;
  const medImg = (html.match(/name ?="mediumImageUri1" value="[^"]*\/([^/"]+)"/) || [])[1] || null;
  const smallImg = (html.match(/name ?="smallImageUri1" value="[^"]*\/([^/"]+)"/) || [])[1] || null;

  // 설명 이미지들 (fs_prod_desc/S0000149/{id}_N.png)
  const descImages = [
    ...new Set(
      [...html.matchAll(/fs_prod_desc\/S0000149\/([A-Za-z0-9_]+\.(?:png|jpg|gif))/gi)].map((m) => m[1])
    ),
  ];

  // 설명 텍스트 (.goods_desc)
  const descMatch = html.match(/<div class="goods_desc">([\s\S]*?)<\/div>/);
  let descText = null;
  if (descMatch) {
    descText = decodeEntities(
      descMatch[1].replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim()
    ).replace(/\n{3,}/g, "\n\n");
  }

  return { name, badge, options, largeImage: largeImg, mediumImage: medImg, smallImage: smallImg, descImages, descText };
}

async function main() {
  const list = JSON.parse(await readFile(join(ROOT, "data", "products-list.json"), "utf-8"));
  const ids = Object.keys(list);
  const products = {};
  let ok = 0, fail = 0;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const base = list[id];
    const cat = base.categories[0];
    const url = `${BASE}/shop/shopproduct/productDetail?categoryId=${cat}&productId=${id}`;
    try {
      const html = await fetchHtml(url);
      const d = parseDetail(html, id);
      products[id] = {
        productId: id,
        name: d.name || base.name,
        badge: d.badge || null,
        price: d.options[0]?.salePrice ?? d.options[0]?.price ?? base.listPrice,
        options: d.options,
        categories: base.categories,
        images: {
          large: d.largeImage,
          medium: d.mediumImage || base.listImage,
          small: d.smallImage,
          desc: d.descImages,
        },
        description: d.descText,
      };
      ok++;
    } catch (e) {
      products[id] = { productId: id, name: base.name, price: base.listPrice, categories: base.categories, error: e.message };
      fail++;
    }
    if ((i + 1) % 20 === 0 || i === ids.length - 1) {
      process.stdout.write(`\r  ${i + 1}/${ids.length} (ok ${ok}, fail ${fail})   `);
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  await writeFile(join(ROOT, "data", "products.json"), JSON.stringify(products, null, 2), "utf-8");
  console.log(`\n완료: ${ok}개 성공, ${fail}개 실패 → data/products.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
