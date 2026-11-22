import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const base = process.env.SERVICE_TEST_BASE_URL;
const form = "https://www.restorystudio.co.kr/request";
const greeting = "안녕하세요, 리스토리 AI 상담사 리토리예요";
const intakeLabel = "빠른 상담 접수";

async function ask(payload) {
  const response = await fetch(new URL("/api/kakao-chatbot", base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(response.status, 200);
  return response.json();
}

function checkIntake(reply) {
  const card = checkFirstForm(reply);
  assert.match(card.description, /확인한 뒤.*답변/);
}

test("Ritori welcomes customers to chat or open the quick intake form", { skip: !base }, async () => {
  for (const payload of [
    { userRequest: { utterance: "", block: { name: "웰컴 블록" } } },
    { userRequest: { utterance: "안녕하세요!" } },
    { userRequest: { utterance: "시작하기" } },
  ]) {
    const reply = await ask(payload);
    const card = checkFirstForm(reply);
    assert.equal(card.title, greeting);
    assert.match(card.description, /채팅에서 바로 물어보세요/);
    assert.match(card.description, /빠른 상담 접수.*담당자가 연락/);
    assert.deepEqual(card.buttons.map(button => button.action), ["webLink", "operator"]);
    assert.equal(reply.data.answer.split(greeting).length - 1, 1);
  }
});

test("both Kakao intake block names and typed intake commands open the form", { skip: !base }, async () => {
  for (const payload of [
    { intent: { name: "상담 접수" }, userRequest: { utterance: "양식이 어디에 있나요?" } },
    { userRequest: { block: { name: intakeLabel }, utterance: "양식이 어디에 있나요?" } },
    { userRequest: { utterance: "접수 링크" } },
    { userRequest: { utterance: "상담 접수하기" } },
    { userRequest: { utterance: intakeLabel } },
  ]) checkIntake(await ask(payload));
});

test("asking for the form after submitting a chat photo still opens the form", { skip: !base }, async () => {
  const user = { id: `form-verification-${crypto.randomUUID()}` };
  const photo = await ask({ userRequest: { user, utterance: "" }, action: { params: { image: "test.jpg" } } });
  const buttons = photo.template.outputs[0].textCard.buttons;
  assert.ok(buttons.some(button => button.action === "operator"));
  assert.ok(buttons.some(button => button.webLinkUrl === form));
  checkIntake(await ask({ userRequest: { user, utterance: "상담 접수" } }));
});

function message(utterance, user, action) {
  return ask({ userRequest: { utterance, user }, action });
}

function checkCard(reply) {
  const { textCard } = reply.template.outputs[0];
  assert.equal(reply.version, "2.0");
  assert.ok(textCard.description);
  assert.ok((textCard.title ?? "").length + textCard.description.length <= 400);
  assert.ok(textCard.buttons.length <= 2 && textCard.buttons.every(button => button.label.length <= 8));
  assert.ok(reply.data.answer.includes(textCard.description));
  return textCard;
}

function checkFirstForm(reply, expectedService = null) {
  const card = checkCard(reply);
  const first = card.buttons[0];
  assert.equal(first.label, intakeLabel);
  assert.equal(first.action, "webLink");
  const url = new URL(first.webLinkUrl);
  assert.equal(url.origin + url.pathname, form);
  assert.equal(url.searchParams.get("service"), expectedService);
  assert.ok(reply.data.answer.includes(`${intakeLabel}\n${url.href}`));
  return card;
}

test("the first answer invites form completion for greetings, direct questions and attachments", { skip: !base }, async () => {
  for (const [utterance, service, action] of [
    ["안녕하세요!"], ["얼마예요?"], ["이번 주말에 방문 가능한가요?"],
    ["인천에서 싱크대 문짝 교체 비용이 얼마예요?", "doors"],
    ["소파가 꺼졌어요", "sofa"], ["", null, { params: { image: "room.jpg" } }],
  ]) {
    const card = checkFirstForm(await message(utterance, undefined, action), service ?? null);
    assert.equal(card.title, greeting);
    assert.match(card.description, /양식|접수/);
    assert.ok(card.buttons.some(button => button.action === "operator"));
  }
});

test("a customer can tap from the cost question to a service and its photo guide across instances", { skip: !base }, async () => {
  let reply = await message("시작하기");
  // No user id or warm cache. Replay exactly what a Kakao quick reply sends back.
  for (const label of ["예상 비용", "소파 꺼짐 수리", "사진 찍는 법"]) {
    const chip = reply.template.quickReplies.find(choice => choice.label === label);
    assert.equal(chip.action, "message");
    reply = await message(chip.messageText, undefined, { clientExtra: chip.extra });
    assert.ok(!reply.data.answer.includes(greeting));
  }
  const card = checkFirstForm(reply, "sofa");
  assert.match(card.description, /꺼진 자리/);
  assert.doesNotMatch(card.description, /연락처/);
});

test("after a photo and an area, the next question gets its own answer", { skip: !base }, async () => {
  const user = { id: crypto.randomUUID() };
  const quote = checkFirstForm(await message("서울 싱크대 문짝 교체 얼마예요?", user), "doors");
  assert.match(quote.description, /개수.*자재/);
  const photo = await message("", user, { params: { secureimage: JSON.stringify({ secureUrls: "List(https://example.test/image)" }) } });
  assert.match(checkCard(photo).title, /사진을 받았/);
  const visit = checkFirstForm(await message("언제 방문할 수 있나요?", user), "doors");
  assert.match(visit.description, /가능한 시간/);
  const followup = checkCard(await message("그럼 비용은요?", user));
  assert.match(followup.description, /개수/);
  assert.doesNotMatch(visit.description + followup.description, /사진.*보내|지역.*알려/);
  assert.equal(checkCard(await message("상담직원 연결", user)).buttons[0].action, "operator");
});

test("reported submission offers help without asking the customer to fill out the form again", { skip: !base }, async () => {
  const user = { id: crypto.randomUUID() };
  await message("상부장이 처졌어요", user);
  for (const utterance of ["양식 제출했어요", "방문 일정은요?", "출장 지역이 궁금해요", "비용은요?"]) {
    const reply = await message(utterance, user);
    assert.deepEqual(checkCard(reply).buttons.map(button => button.action), ["operator"]);
    assert.ok(!reply.data.answer.includes(form));
  }
  checkFirstForm(await message("접수 양식", user), "upper");
  checkFirstForm(await message("새 상담", user));
});

test("photo questions, profile metadata and empty image fields do not count as photos", { skip: !base }, async () => {
  const reply = await ask({
    userRequest: { user: { id: "photo-test", properties: { profileImage: "https://example.test/profile.jpg" } }, utterance: "사진이 없어요" },
    action: { params: { image: "", file: "https://example.test/invoice.pdf" } },
  });
  assert.match(checkFirstForm(reply).description, /선택 항목/);
  assert.equal(reply.template.quickReplies[0].extra.consultation.photo, "unavailable");
  const guide = await message("어떤 사진을 찍을까요?", undefined, { params: { media: null } });
  assert.match(checkCard(guide).description, /전체 모습/);
});

test("an explicit visit question takes precedence over a pending price question", { skip: !base }, async () => {
  const user = { id: crypto.randomUUID() };
  await message("비용이 얼마예요?", user);
  const visit = checkFirstForm(await message("소파 꺼짐 수리는 언제 방문할 수 있나요?", user), "sofa");
  assert.match(visit.title, /방문일/);
  const finish = checkFirstForm(await message("소파 가죽 복원 비용도 알려주세요", user), "leather");
  assert.match(finish.description, /가죽/);
  assert.doesNotMatch(finish.description, /좌석/);
});

test("the first form link opens with the recognized item already editable", { skip: !base }, async () => {
  for (const [utterance, expected] of [
    ["시작하기", ""],
    ["소파가 꺼졌어요", "소파 수리"],
    ["상판 크랙 수리에 얼마 들어요?", "싱크대 상판 크랙 수리"],
  ]) {
    const reply = await message(utterance);
    const link = new URL(checkCard(reply).buttons[0].webLinkUrl);
    const res = await fetch(new URL(link.pathname + link.search, base));
    assert.equal(res.status, 200);
    const html = parse(await res.text());
    assert.equal(html.querySelector("h1")?.textContent, intakeLabel);
    assert.ok(html.querySelector("title")?.textContent.includes(intakeLabel));
    assert.equal(html.querySelector('meta[property="og:title"]')?.getAttribute("content"), `리스토리 스튜디오 ${intakeLabel}`);
    const option = html.querySelector('select[name="item"] option[selected]');
    assert.ok(option);
    const selected = option.getAttribute("value") ?? option.textContent;
    const item = selected === "custom" ? html.querySelector('input[name="customItem"]').getAttribute("value") : selected;
    assert.equal(item, expected);
  }
});
