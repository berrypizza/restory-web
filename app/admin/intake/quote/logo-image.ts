const PNG_LIMIT = 150 * 1024;
const FILE_LIMIT = 10 * 1024 * 1024;

function supportedImage(bytes: Uint8Array) {
  if (bytes.length < 12) return false;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)) return true;
  return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
}

function imageLoaded(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 열 수 없어요. 다른 사진을 선택해 주세요."));
    image.src = url;
  });
}

function readDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("로고를 읽지 못했어요. 다시 선택해 주세요."));
    reader.readAsDataURL(blob);
  });
}

export async function normalizeLogo(file: File): Promise<string> {
  if (!file.size || file.size > FILE_LIMIT)
    throw new Error("10MB 이하의 사진을 선택해 주세요.");
  if (!supportedImage(new Uint8Array(await file.slice(0, 12).arrayBuffer())))
    throw new Error("PNG, JPG, WebP 형식의 사진을 선택해 주세요.");

  const url = URL.createObjectURL(file);
  try {
    const image = await imageLoaded(url);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height || width * height > 64_000_000)
      throw new Error("이미지 해상도가 너무 커요. 크기를 줄인 사진을 선택해 주세요.");

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("로고를 준비할 수 없어요. 다른 브라우저로 시도해 주세요.");
    const longestSide = Math.max(width, height);
    let side = Math.min(256, longestSide);
    for (;;) {
      const scale = side / longestSide;
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!png?.size) throw new Error("로고를 준비하지 못했어요. 다른 사진을 선택해 주세요.");
      if (png.size <= PNG_LIMIT) return readDataUrl(png);
      if (side <= 1) throw new Error("로고 용량을 줄이지 못했어요. 다른 사진을 선택해 주세요.");
      side = Math.max(1, Math.floor(side * 0.75));
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}
