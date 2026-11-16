# 기살 영상 → 상담 전환 측정

2026-11-16. 기존 상담 항목·제출 API·디자인·과정별 측정은 유지한다.

## 수집 규칙

| 이벤트 | 발생 시점 |
| --- | --- |
| `academy_video_start` | YouTube IFrame API가 실제 PLAYING(1)을 알릴 때 |
| `academy_video_complete` | 재생을 시작한 플레이어가 ENDED(0)를 알릴 때 |

포스터 클릭이나 플레이어 로드만으로 시작을 집계하지 않는다. 일시정지·버퍼링·재개·다시보기로 중복 발생하지 않으며, 각 이벤트는 플레이어를 마운트한 동안 한 번씩 발생한다. 페이지 재방문은 새로운 재생으로 집계될 수 있다. GA4 자동 수집 `video_start`/`video_complete`와 혼동하지 않도록 별도 이벤트명을 사용한다. 두 종류를 합산하지 않는다.

`complete`는 **영상 끝에 도달했다는 뜻**이다. 사용자가 탐색할 수 있으므로 모든 초를 시청했다거나 내용을 숙지했다는 뜻은 아니다. 실제 재생 신호로만 측정하며 재생 시간·진도율은 이번 범위에 포함하지 않는다. YouTube 앱/외부 사이트로 이동한 뒤의 재생은 추적하지 않는다.

영상 이벤트의 고정 매개변수:

- `academy_video`: `intro`(교육 소개, `4VhMLfsfHks`) / `brothers`(기존 형제 영상, `TcMbB4Skd90`)
- `video_id`, `video_title`, `video_provider=youtube`
- `intro_video_state`, `brothers_video_state`: `not_started` / `started` / `completed`

두 시청 상태는 기존 모든 상담 CTA 및 `academy_consult_start`, `academy_consult_step_view`, `academy_consult_submit_attempt`, `academy_consult_submit_error`, `academy_consult_submit_success`에도 전달된다. 이름·연락처·자유 입력 내용·신청 ID는 분석 이벤트에 추가하지 않는다.

## 과정별 연결과 수명

- 기존 `source_plan=basic|setup|undecided`, `source_cta` 값 및 이벤트명은 그대로다. 기존 `plan=premium`도 변경하지 않는다.
- 마지막 관측 영상 이벤트로부터 30분 이내의 상태를 sessionStorage와 CTA URL에 담는다. 저장소가 차단되면 메모리로 대체한다. 이 30분은 연결 유효기간이며 GA4 세션과 동일하다는 뜻이 아니다.
- CTA 새 탭 열기·새로고침에도 유효한 URL 상태를 사용한다. 만료·미래 시각·중복 매개변수·허용하지 않은 값은 무시한다.
- 상담 진입 시 상태를 고정하여 작성 시간·단계 이동·제출 재시도에 영향을 받지 않는다. 직접 상담 URL에 들어오면 이전 상담의 상태를 자동 상속하지 않는다.
- `not_started`는 **유효한 재생 기록이 관측되지 않음**이다. 차단 도구, 만료, 다른 기기 등의 이유가 있어 실제 미시청과 같지 않다.
- 사용자 브라우저에서 수집하는 마케팅 분석값이다. URL 수정이나 공유가 가능하며 결제·권한·성과 증명의 근거로 사용하지 않는다.

## GA4 관리자 설정

관리자 → 데이터 표시 → 맞춤 정의에서 다음 **이벤트 범위** 측정기준을 등록한다. 이미 있으면 중복 생성하지 않는다.

| 표시 이름 | 이벤트 매개변수 |
| --- | --- |
| 기살 영상 종류 | `academy_video` |
| 기살 교육영상 시청 상태 | `intro_video_state` |
| 기살 형제영상 시청 상태 | `brothers_video_state` |

기존 과정(`source_plan`)·CTA(`source_cta`)·단계(`step`) 정의와 보고서는 유지한다. 맞춤 정의 등록 및 데이터 처리 전에는 탐색 보고서에서 새 항목을 바로 사용할 수 없을 수 있다. 코드 배포가 GA4 관리자 설정 저장을 대신하지 않는다.

## 탐색 보고서 구성

새 탐색 이름: **기살 · 영상에서 상담 완료까지**. 모든 단계는 간접적으로 다음 단계로 이어지도록 설정한다. 신규 배포 이후 날짜로 보고, 기존 테스트 제외 세그먼트/필터를 그대로 복제한다. 과거 테스트 종료 기준인 **2026-11-15 02:00 KST 이전 제외**도 유지한다. 날짜만 11월 15일로 설정하면 오전 2시 이전 데이터가 포함되므로 기존 시간 기준 필터를 보존한다.

1. **재생 → 상담** 닫힌 유입경로
   - `academy_video_start` AND `academy_video=intro`
   - 이벤트명 정규식 `^academy_(hero_cta_click|plan_cta_click|cta_click)$` AND `intro_video_state`가 `started|completed`
   - `academy_consult_start` AND 같은 시청 상태 조건
   - `academy_consult_step_view` AND `step=2` AND 같은 시청 상태 조건
   - `academy_consult_step_view` AND `step=3` AND 같은 시청 상태 조건
   - `academy_consult_submit_success` AND 같은 시청 상태 조건
2. **완료 시청 → 상담**: 첫 단계를 `academy_video_complete` AND `academy_video=intro`로 바꾸고 이후 단계의 `intro_video_state=completed`로 제한한다.
3. **490·990 비교**: 상담 시작부터 위 3~6단계를 사용하고 `source_plan`으로 분류한다. `intro_video_state`로 관측 없음/재생/종료를 나눠 본다. 재생 이벤트에는 아직 관심 과정이 없으므로 재생 단계부터 `source_plan` 분류를 강제하지 않는다.
4. **형제 영상**은 1·2 탭을 복제해 `academy_video=brothers`, 상태 조건을 `brothers_video_state`로 바꾼다.

완료 시청을 전체 상담 유입경로의 필수 단계로 넣지 않는다. 중간까지 보고 상담한 사람도 별도로 분석해야 한다. 과정별 신청 완료율은 동일 조건의 상담 시작 사용자 대비 완료 사용자로 비교한다. 사용자 단위 GA4 탐색은 여러 방문/기기 연결 설정의 영향을 받으므로 원시 이벤트 수 비율을 개인별 정확한 전환율로 해석하지 않는다. 영상 시청과 신청의 연관성은 볼 수 있지만 영상의 인과 효과를 증명하지는 않는다.

## 검증

- `node --test scripts/academy-attribution.test.mjs`: 27개 통과. 기존 과정별 경로, 실제 상태 신호, 중복 억제, 4개 CTA의 영상 상태 전파, 단계/실패/재시도/성공, 만료·오염 입력·저장소 차단을 확인.
- 변경 TypeScript/TSX ESLint 및 프로덕션 빌드 통과.
- 별도 로컬 프록시에서 실제 YouTube 재생·끝 도달 및 형제 영상 재생 확인. GA4 수집 스크립트는 차단하고 앱이 생성한 이벤트를 로컬로만 수집한다.
- 신청 성공의 브라우저 검증은 제출 RPC를 로컬에서 성공 응답으로 대체한다. 실제 고객 신청을 만들거나 운영 GA4에 테스트 전환을 보내지 않는다. 실제 데이터베이스 저장 검증과 구분한다.

참고: [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference), [GA4 유입경로 탐색](https://support.google.com/analytics/answer/9327974?hl=ko).
