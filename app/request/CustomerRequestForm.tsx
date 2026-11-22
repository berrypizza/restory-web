"use client";

import { useRef, useState, type FormEvent } from "react";
import { isProductOption, PRODUCT_OPTIONS } from "../admin/lib/products";
import PhotoPicker, { type SelectedPhoto } from "./PhotoPicker";
import s from "./request.module.css";

export default function CustomerRequestForm({ initialItem = "" }: { initialItem?: string }) {
  const customItem = initialItem && !isProductOption(initialItem) ? initialItem : "";
  const [product, setProduct] = useState(customItem ? "custom" : initialItem);
  const [phase, setPhase] = useState<"ready" | "sending" | "done">("ready");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [preparing, setPreparing] = useState(false);
  const requestId = useRef<string | null>(null);
  const pending = useRef(false);
  const success = useRef<HTMLHeadingElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || preparing) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const field = (key: string) => String(fields.get(key) ?? "").trim();
    const phone = field("phone").replace(/[\s()-]/g, "").replace(/^\+820?/, "0");
    const invalid = !field("name") ? "name" : !/^(0[1-9]\d{7,9}|050\d{9})$/.test(phone) ? "phone"
      : field("address").length < 2 ? "address" : product === "custom" && !field("customItem") ? "customItem" : null;
    if (invalid) {
      setError(invalid === "phone" ? "전화번호를 지역번호 또는 010부터 확인해 주세요." : "입력한 내용을 확인해 주세요.");
      (form.elements.namedItem(invalid) as HTMLInputElement)?.focus();
      return;
    }
    pending.current = true;
    setError("");
    setPhase("sending");
    try {
      requestId.current ??= crypto.randomUUID();
      const res = await fetch("/api/customer-intake", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId.current, name: field("name"), phone, address: field("address"),
          item: product === "custom" ? field("customItem") : product, notes: field("notes"), consent: fields.has("consent"),
          photos: photos.map(({ image, thumbnail }) => ({ image, thumbnail })) }),
      });
      if (!res.ok) {
        setError(res.status === 400 ? "이름, 전화번호, 주소와 품목을 다시 확인해 주세요." : "접수 결과를 확인하지 못했어요. 다시 보내 주세요.");
        setPhase("ready");
        return;
      }
      setPhotos([]);
      setPhase("done");
      window.requestAnimationFrame(() => success.current?.focus());
    } catch {
      setError("인터넷 연결을 확인하고 다시 보내 주세요. 입력한 내용은 이 화면에 남아 있어요.");
      setPhase("ready");
    } finally {
      pending.current = false;
    }
  }

  if (phase === "done") return <section className={s.success}>
    <span className={s.check} aria-hidden="true">✓</span>
    <h1 tabIndex={-1} ref={success}>상담이 접수됐어요</h1>
    <p>담당자가 보내 주신 내용을 확인한 뒤 남겨 주신 연락처로 답변드릴게요. 방문이 필요하면 그때 일정을 함께 정해요.</p>
  </section>;

  return <>
    <div className={s.intro}><h1>현장 상담 접수</h1><p>상담할 품목과 방문 주소를 남겨 주세요.<br />담당자가 내용을 확인한 뒤 답변드릴게요.</p></div>
    <form className={s.card} method="post" onSubmit={submit} onInvalid={() => setChecking(true)}>
      <fieldset disabled={phase === "sending"} className={checking ? s.checked : undefined}>
        <label>상담 품목<select required name="item" value={product} onChange={e => setProduct(e.target.value)}>
          <option value="" disabled>품목을 선택해 주세요</option>
          {PRODUCT_OPTIONS.map(item => <option key={item}>{item}</option>)}
          <option value="custom">기타 · 직접 입력</option>
        </select></label>
        {product === "custom" && <label>상담할 품목<input name="customItem" defaultValue={customItem} placeholder="어떤 가구나 수리가 필요한가요?" maxLength={100} required /></label>}
        <label>이름<input name="name" autoComplete="name" maxLength={60} placeholder="성함" required /></label>
        <label>전화번호<input name="phone" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={23} placeholder="010-0000-0000" required /></label>
        <label>방문 주소<input name="address" autoComplete="street-address" minLength={2} maxLength={250} placeholder="도로명 또는 지번, 동·호수" required /></label>
        <label><span>상담 내용 <small>선택</small></span><textarea name="notes" rows={3} maxLength={800} placeholder="불편한 점이나 미리 알려주실 내용을 적어 주세요." /></label>
        <PhotoPicker photos={photos} onChange={setPhotos} onBusy={setPreparing} />
        <label className={s.consent}><input name="consent" type="checkbox" required />
          <span>리스토리 스튜디오가 상담 연락과 방문 일정 관리를 위해 이름, 전화번호, 주소, 상담 내용과 첨부한 사진을 수집·이용하는 데 동의해요.</span>
        </label>
      </fieldset>
      {error && <p role="alert" className={s.error}>{error}</p>}
      <button type="submit" className={s.primary} disabled={preparing || phase === "sending"}>{preparing ? "사진 준비 중…" : phase === "sending" ? "접수하는 중…" : "상담 접수하기"}</button>
    </form>
  </>;
}
