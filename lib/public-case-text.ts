const PRICE_AMOUNT_PATTERN =
  /(?:[$₩]\s*\d|\d[\d,]*(?:\.\d+)?\s*(?:~|-|부터|에서)?\s*\d*[\d,]*(?:\.\d+)?\s*(?:만원|만\s*원|원)|\d[\d,]*(?:\.\d+)?\s*留뚯썝)/;

export function sanitizePublicCaseText(text: string) {
  return text
    .split(/\r?\n/)
    .filter((line) => !PRICE_AMOUNT_PATTERN.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
