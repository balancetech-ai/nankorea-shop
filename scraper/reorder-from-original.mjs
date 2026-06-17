// data/_original-order.json(라이브 원본 진열순서) 기준으로 categories.json 의 productIds 순서를 재정렬.
// 규칙: [원본순서 ∩ 우리상품] 먼저, 그 뒤 [라이브엔 없지만 우리 데이터엔 있는 상품]은 기존 상대순서로 append.
// 직접 ID 매칭 우선. 직접 ID 없는 카테고리만 수동 매핑(X2->111). X1은 원본에 없어 그대로.
import fs from 'fs';

const orig = JSON.parse(fs.readFileSync('data/_original-order.json', 'utf8'));
const cats = JSON.parse(fs.readFileSync('data/categories.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

// 직접 ID가 없는 카테고리 매핑 (productId 겹침분석 결과)
const MANUAL = { X2: '111' };  // X1(폭포석)은 원본 진열에 없어 미적용

let changed = 0;
for (const c of cats) {
  const origId = orig[c.id] ? c.id : MANUAL[c.id];
  if (!origId || !orig[origId]) { console.error(`- ${c.id} ${c.name}: 원본순서 없음 → 유지(${c.productIds.length})`); continue; }

  const order = orig[origId];
  const ours = new Set(c.productIds);
  const ordered = order.filter((pid) => ours.has(pid));      // 원본순서 ∩ 우리
  const orderedSet = new Set(ordered);
  const rest = c.productIds.filter((pid) => !orderedSet.has(pid)); // 라이브에 없는 우리상품
  const next = [...ordered, ...rest];

  const same = next.length === c.productIds.length && next.every((v, i) => v === c.productIds[i]);
  console.error(`${c.id} ${c.name}: 원본순서적용 ${ordered.length} + 뒤에붙임 ${rest.length} = ${next.length} ${same ? '(변화없음)' : '★재정렬'}`);
  if (!same) { c.productIds = next; changed++; }
}

fs.writeFileSync('data/categories.json', JSON.stringify(cats, null, 2) + '\n');
console.error(`\n-> ${changed}개 카테고리 재정렬, categories.json 저장`);
