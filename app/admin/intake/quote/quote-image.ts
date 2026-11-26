import { quoteTotal, won, type CustomerQuote } from "./quote";

const width = 840;
const margin = 52;
const right = width - margin;
const ink = "#17283c";
const muted = "#53667a";
const blue = "#2557b8";
const fontFamily = '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans CJK KR", sans-serif';
const font = (size: number, weight = 500) => `${weight} ${size}px ${fontFamily}`;

function wrapped(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of value.split(/\r?\n/)) {
    let line = "";
    for (const char of Array.from(paragraph)) {
      if (line && ctx.measureText(line + char).width > maxWidth) {
        lines.push(line.trimEnd());
        line = char.trimStart();
      } else {
        line += char;
      }
    }
    lines.push(line.trimEnd());
  }
  return lines;
}

async function loadLogo(url: string) {
  const logo = new Image();
  logo.decoding = "async";
  logo.src = url;
  try {
    await logo.decode();
  } catch {
    throw new Error("업체 로고를 불러오지 못했어요. 연결을 확인하고 다시 시도해 주세요.");
  }
  return logo;
}

export async function createQuoteImage(quote: CustomerQuote): Promise<Blob> {
  const [logo] = await Promise.all([quote.issuer.logoUrl ? loadLogo(quote.issuer.logoUrl) : null, document.fonts?.ready]);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이 브라우저에서 이미지를 만들지 못했어요.");
  const ctx = context;

  const brandX = logo ? margin + 94 : margin;
  ctx.font = font(28, 700);
  const brandLines = wrapped(ctx, quote.issuer.name, right - brandX);
  ctx.font = font(24, 650);
  const customerLines = wrapped(ctx, quote.customer + " 고객님", right - margin - 86);
  ctx.font = font(22, 600);
  const rows = quote.lines.map(line => {
    const names = wrapped(ctx, line.name, 274);
    return { ...line, names, height: Math.max(64, names.length * 32 + 28) };
  });
  ctx.font = font(21);
  const notes = quote.note ? wrapped(ctx, quote.note, right - margin) : [];
  const brandBottom = 48 + Math.max(logo ? 72 : 0, brandLines.length * 38 + (quote.issuer.registrationNumber ? 34 : 0));
  const headingY = brandBottom + 54;
  const recipientY = headingY + 78;
  const totalY = recipientY + customerLines.length * 36 + 32;
  const tableY = totalY + 126;
  const tableBottom = tableY + 48 + rows.reduce((sum, row) => sum + row.height, 0);
  const height = Math.ceil(tableBottom + (notes.length ? 87 + 32 * notes.length : 0) + 64);
  const scale = 1.5;
  canvas.width = width * scale;
  canvas.height = Math.ceil(height * scale);
  ctx.scale(scale, scale);
  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  function text(value: string, x: number, y: number, size: number, weight = 500, color = ink, align: CanvasTextAlign = "left") {
    ctx.font = font(size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(value, x, y);
  }
  function rule(y: number) {
    ctx.fillStyle = "#dbe2ea";
    ctx.fillRect(margin, y, right - margin, 1);
  }

  if (logo) {
    const ratio = Math.min(76 / logo.naturalWidth, 70 / logo.naturalHeight);
    const w = logo.naturalWidth * ratio, h = logo.naturalHeight * ratio;
    ctx.drawImage(logo, margin + (76 - w) / 2, 48 + (70 - h) / 2, w, h);
  }
  brandLines.forEach((line, i) => text(line, brandX, 48 + i * 38, 28, 700));
  if (quote.issuer.registrationNumber) {
    text("사업자등록번호  " + quote.issuer.registrationNumber, brandX, 52 + brandLines.length * 38, 20, 500, muted);
  }
  rule(brandBottom + 20);
  text("견적서", margin, headingY, 50, 750);
  text("발행일  " + quote.issued.replaceAll("-", "."), right, headingY + 24, 21, 500, muted, "right");
  text("받는 분", margin, recipientY + 2, 20, 500, muted);
  customerLines.forEach((line, i) => text(line, margin + 86, recipientY + i * 36, 24, 650));

  ctx.fillStyle = "#edf3fe";
  ctx.fillRect(margin, totalY, right - margin, 96);
  text("총 견적 금액", margin + 24, totalY + 34, 23, 650, blue);
  text(won(quoteTotal(quote.lines)), right - 24, totalY + 25, 37, 750, blue, "right");
  text("품목", margin, tableY + 8, 18, 650, muted);
  text("수량", 406, tableY + 8, 18, 650, muted, "right");
  text("단가", 586, tableY + 8, 18, 650, muted, "right");
  text("금액", right, tableY + 8, 18, 650, muted, "right");
  let y = tableY + 48;
  rule(y);
  for (const row of rows) {
    row.names.forEach((name, i) => text(name, margin, y + 17 + i * 32, 22, 600));
    text(String(row.quantity), 406, y + 19, 20, 500, ink, "right");
    text(won(row.unitPrice), 586, y + 19, 20, 500, ink, "right");
    text(won(row.quantity * row.unitPrice), right, y + 18, 21, 650, ink, "right");
    y += row.height;
    rule(y);
  }
  if (notes.length) {
    text("견적 안내", margin, y + 34, 21, 650);
    notes.forEach((line, i) => text(line, margin, y + 76 + i * 32, 21, 500, muted));
  }
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => {
    if (blob) resolve(blob);
    else reject(new Error("이미지를 저장할 수 없어요. 다시 시도해 주세요."));
  }, "image/png"));
}
