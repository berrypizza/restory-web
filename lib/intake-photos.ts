export const MAX_INTAKE_PHOTOS = 6;
export const MAX_PHOTO_BYTES = 440_000;
export const MAX_THUMB_BYTES = 22_000;

export type IntakePhoto = { image: string; thumbnail: string };

export async function prepareIntakePhoto(file: File): Promise<IntakePhoto> {
  if (!file.size || file.size > 32_000_000) throw new Error("사진 한 장은 32MB까지 선택할 수 있어요.");
  const source = new Image();
  const url = URL.createObjectURL(file);
  try {
    source.src = url;
    await source.decode().catch(() => { throw new Error("이 사진을 열 수 없어요. JPG, PNG 또는 이 기기에서 열리는 사진을 선택해 주세요."); });
    function encode(maxSide: number, limit: number) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("사진을 처리하지 못했어요. 다시 선택해 주세요.");
      let scale = Math.min(1, maxSide / Math.max(source.naturalWidth, source.naturalHeight));
      for (let attempt = 0; attempt < 6; attempt++) {
        canvas.width = Math.max(1, Math.round(source.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(source.naturalHeight * scale));
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
        const encoded = canvas.toDataURL("image/jpeg", attempt ? 0.78 : 0.87).split(",")[1];
        if (encoded && encoded.length <= Math.floor(limit / 3) * 4) return encoded;
        scale *= 0.78;
      }
      throw new Error("사진 용량을 줄이지 못했어요. 다른 사진으로 시도해 주세요.");
    }
    return { image: encode(1800, MAX_PHOTO_BYTES), thumbnail: encode(240, MAX_THUMB_BYTES) };
  } finally { URL.revokeObjectURL(url); }
}
