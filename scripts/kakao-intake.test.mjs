import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.SERVICE_TEST_BASE_URL;
const form = "https://www.restorystudio.co.kr/request";

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
  assert.equal(reply.version, "2.0");
  const card = reply.template.outputs[0].textCard;
  assert.deepEqual(card.buttons[0], { label: "상담 접수하기", action: "webLink", webLinkUrl: form });
  assert.match(card.description, /확인한 뒤.*답변/);
  assert.ok(reply.data.answer.includes(form));
}

test("Kakao welcome and returning-customer blocks open the public intake form", { skip: !base }, async () => {
  for (const payload of [
    { userRequest: { utterance: "", block: { name: "웰컴 블록" } } },
    { intent: { name: "상담 접수" }, userRequest: { utterance: "양식이 어디에 있나요?" } },
    { userRequest: { utterance: "접수 링크" } },
    { userRequest: { utterance: "안녕하세요!" } },
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
