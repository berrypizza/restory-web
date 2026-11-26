export type QuoteIssuer = {
  name: string;
  logoUrl: string | null;
  registrationNumber?: string | null;
};

export type QuoteLine = { name: string; quantity: number; unitPrice: number };
export type CustomerQuote = {
  issuer: QuoteIssuer;
  customer: string;
  issued: string;
  lines: QuoteLine[];
  note: string;
};

export const maxQuoteTotal = 2_147_483_647;
export const maxQuoteLines = 12;
export const won = (amount: number) => amount.toLocaleString("ko-KR") + "원";

export function normalizeRegistration(value: string): string | null {
  const raw = value.trim();
  if (!raw) return "";
  if (!/^(?:\d{10}|\d{3}-\d{2}-\d{5})$/.test(raw)) return null;
  return raw.replaceAll("-", "").replace(/^(\d{3})(\d{2})(\d{5})$/, "$1-$2-$3");
}

export function readWon(value: string): number | null {
  const text = value.trim();
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(text)) return null;
  const amount = Number(text.replaceAll(",", ""));
  return Number.isSafeInteger(amount) && amount <= maxQuoteTotal ? amount : null;
}

export function quoteTotal(lines: QuoteLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
}
