import { REGIONS } from "@/lib/seo-regions";
import { isService, type Service } from "@/lib/consultation-services";

type Attachments = { attachments?: unknown; media?: unknown; image?: unknown };

export type SkillRequest = Attachments & {
  intent?: { name?: unknown };
  userRequest?: Attachments & {
    utterance?: unknown;
    block?: { name?: unknown };
    user?: { id?: unknown };
    params?: unknown;
  };
  action?: { params?: unknown; detailParams?: unknown; clientExtra?: { consultation?: unknown } };
};

// Keep only what changes the next answer. Photo URLs, chat text and addresses
// stay out of both the process cache and the quick-reply payload.
export type Conversation = {
  service: Service | null;
  area: "metro" | "other" | null;
  photo: "sent" | "unavailable" | null;
  submitted: boolean;
  awaitingPriceItem: boolean;
  updatedAt: number;
};

export function newConversation(): Conversation {
  return { service: null, area: null, photo: null, submitted: false, awaitingPriceItem: false, updatedAt: 0 };
}

const sessions = new Map<string, Conversation>();
const SESSION_TTL_MS = 30 * 60 * 1000;

function isRecent(value: unknown): value is Conversation {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Conversation>;
  return typeof data.updatedAt === "number" && data.updatedAt <= Date.now()
    && Date.now() - data.updatedAt < SESSION_TTL_MS
    && (data.service === null || isService(data.service))
    && (data.photo === null || data.photo === "sent" || data.photo === "unavailable")
    && (data.area === null || data.area === "metro" || data.area === "other")
    && typeof data.submitted === "boolean"
    && typeof data.awaitingPriceItem === "boolean";
}

export function readConversation(userId: string | null, buttonContext: unknown): Conversation {
  const cached = userId ? sessions.get(userId) : undefined;
  // A tap may land on a different server instance from the previous turn.
  if (isRecent(buttonContext) && (!isRecent(cached) || buttonContext.updatedAt > cached.updatedAt)) {
    const { service, area, photo, submitted, awaitingPriceItem, updatedAt } = buttonContext;
    return { service, area, photo, submitted, awaitingPriceItem, updatedAt };
  }
  return isRecent(cached) ? { ...cached } : newConversation();
}

export function saveConversation(userId: string | null, context: Conversation) {
  context.updatedAt = Date.now();
  if (!userId) return;
  sessions.delete(userId);
  sessions.set(userId, context);
  if (sessions.size > 500) {
    const oldest = sessions.keys().next().value;
    if (oldest !== undefined) sessions.delete(oldest);
  }
}

const metroNames = [...new Set([...REGIONS, "서울", "경기", "수도권", "고양", "하남", "성남", "분당",
  "용인", "수원", "안양", "안산", "화성", "평택", "남양주", "구리", "의정부"])];
const areaEnding = "(?=$|[\\s,.!?~]|시|도|군|구|에서|쪽|인데|입니다|예요|이에요|이요|요|지역|까지|은|는|에|으로|로)";
const metroArea = new RegExp(`(?:${metroNames.join("|")})${areaEnding}`);
const otherArea = new RegExp(`(?:제주|부산|대구|대전|광주광역시|울산|세종|강원|충청|충북|충남|경상|경북|경남|전라|전북|전남|강릉|청주|천안|전주|창원|그 외 지역)${areaEnding}`);

export function findArea(utterance: string): Conversation["area"] {
  if (otherArea.test(utterance)) return "other";
  return metroArea.test(utterance) ? "metro" : null;
}

export function isPhotoUrl(text: string) {
  return /^https?:\/\/\S+\.(?:jpe?g|png|webp|heic)(?:[?#]\S*)?$/i.test(text);
}

function containsImage(value: unknown, imageField = false): boolean {
  if (typeof value === "string") {
    const text = value.trim();
    // The secure-image plugin sends its parameters as a JSON string.
    if (text.startsWith("{") || text.startsWith("[")) {
      try { return containsImage(JSON.parse(text), imageField); } catch { return false; }
    }
    if (isPhotoUrl(text)) return true;
    return imageField && /^(?:https?:\/\/\S+|List\(https?:\/\/.+\)|[^\s/]+\.(?:jpe?g|png|webp|heic)|data:image\/[^,]+,.+)$/i.test(text);
  }
  if (Array.isArray(value)) return value.some(item => containsImage(item, imageField));
  if (!value || typeof value !== "object") return false;
  const fields = value as Record<string, unknown>;
  const isImage = imageField || fields.type === "image" || (typeof fields.mimeType === "string" && fields.mimeType.startsWith("image/"));
  return Object.entries(fields).some(([key, child]) =>
    containsImage(child, isImage || /^(?:image|images|photo|photos|secureimage|secureUrls|imageUrl)$/i.test(key)));
}

export function hasAttachedPhoto(body: SkillRequest, utterance: string) {
  return isPhotoUrl(utterance) || containsImage(body.action?.params)
    || containsImage(body.action?.detailParams) || containsImage(body.userRequest?.params)
    || containsImage(body.image, true) || containsImage(body.userRequest?.image, true)
    || containsImage([body.media, body.attachments, body.userRequest?.media, body.userRequest?.attachments]);
}
