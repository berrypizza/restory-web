# 서비스 랜딩 GA4 계측 (service_v1)

2026-11-19 신규 계측. GA4 속성 417800664 / G-ZT8HRBBXVR. 기존 기살 basic/setup, 영상, 상담 이벤트 및 탐색은 수정하지 않는다.

## 이벤트와 개인정보 경계

| 이벤트 | 의미 | 추가 매개변수 |
|---|---|---|
| service_landing_view | 실제 서비스 랜딩 방문 | 공통 필드 |
| service_section_view | 구간 제목/앵커 면적 50% 이상이 1초 연속 보임 | section_id, section_order, visible_ratio, dwell_ms |
| service_section_progress | 노출된 구간에서 뒤 구간 또는 상담 클릭으로 진행 | section_id, section_order, progress_type, next_section_id, next_section_order(뒤 구간), channel(상담) |
| service_contact_click | 카카오/전화 링크 클릭 | channel, cta_location, section_id, section_order, last_section_id, last_section_order |

공통: service_id(허용 목록), traffic_class=production, measurement_version=service_v1, 쿼리/해시 없는 page_location, page_path(최대 100자 요약), page_referrer(출처 origin만).
전체 실제 경로는 GA4 사전 정의된 페이지 경로를 사용한다. 사용자 입력, 링크 텍스트, 사진, 전화번호, 쿼리 문자열을 새 서비스 이벤트에 넣지 않는다. 기존 자동 GA4 이벤트의 전역 동작은 이번 변경 범위 밖이다.

- channel: kakao / phone. cta_location: fixed / body / header / footer.
- 클릭은 실제 메시지 발송, 전화 연결, 사진 제출, 상담 완료, 계약/매출이 아니다.
- 정확히 같은 채널·위치·구간에서 1초 이내 중복 클릭을 제외한다. 정상 재클릭은 이벤트에 포함되므로 전환율 분자는 고유 사용자 또는 순차 퍼널 완료 사용자로 계산한다.
- /go 리다이렉트에서 추가 이벤트를 발생시키지 않는다. 실제 링크 이동을 막거나 기다리게 하지 않는다.
- 구간 노출은 방문당 1회. 다른 pathname으로 이동하면 새 방문이다. StrictMode/재렌더/제목 노드 교체 시 중복 방지.
- section_order는 해당 템플릿의 실제 DOM 순서(1부터)다. 지역 소개/리뷰 탭 등에 따라 달라질 수 있다. 이름인 section_id를 우선 사용한다.
- 제목이 없는 구간은 첫 자식 앵커를 사용한다. 접힌 상세/숨긴 리뷰는 실제 앵커가 보일 때만 노출된다. 제목 노출은 본문 완독을 뜻하지 않는다.
- fixed/header 여백 각 88px를 관측 영역에서 제외한다. 탭이 숨겨지거나 가시율 미달이면 연속 체류 타이머를 초기화한다.
- 이미 본 구간마다 최초 후속 진행을 한 번 기록한다. 중간 구간을 건너뛰면 실제 본 구간만 기록한다. last_section_id는 마지막 **신규** 적격 노출이며 되돌아간 위치를 뜻하지 않는다.

## 테스트 제외

새 이벤트는 www.restorystudio.co.kr / restorystudio.co.kr 에서만 전송한다. localhost와 preview는 전송하지 않는다. 최초 QA 진입 시 analytics_qa=1 또는 sessionStorage restory_analytics_qa=1은 탭 세션 동안 새 서비스 계측을 차단한다. 기존 GA4/Vercel/DB까지 차단하는 QA 프록시를 별도로 사용했으며 운영 합성 이벤트와 테스트 신청은 만들지 않았다.

기존 기살 탐색의 2026-11-15 02:00 KST 이전 제외 기준은 유지한다. 일반 서비스 보고서에는 source_plan 필터를 적용하지 않는다. 실제 내부 방문은 표식 없이는 자동 식별할 수 없으므로 모두 고객으로 단정하지 않는다.

## GA4 관리자 설정

2026-11-19 이벤트 범위 맞춤 측정기준 10개를 UI에서 저장 확인:
service_id, channel, cta_location, section_id, section_order, progress_type, next_section_id, last_section_id, traffic_class, measurement_version.
기존 6개 정의는 그대로 유지. 고유값이 많은 page_path는 맞춤 등록하지 않았다. next_section_order/last_section_order는 전송하지만 추가 맞춤 정의를 만들지 않았다.

새 탐색: 리스토리 서비스 상담·구간 분석 · service_v1
https://analytics.google.com/analytics/web/#/analysis/a294642617p417800664/edit/7RGaVCXPR4uaA4jKkTmUAg

저장된 4개 탭: 방문 → 상담 클릭 · 서비스별 / 모바일 방문 → 상담 클릭 / 모바일 → 카카오 클릭 / 모바일 → 전화 클릭. 카카오·전화 조건은 각각 2단계에만 적용한다. 현재 조회 날짜는 2026-11-19(오늘)이며, 정기 분석 시 시작일/종료일을 보고 기간에 맞춰 확인한다. 구간별 분석 방법은 아래 기준을 따르며 별도 구간 탐색 탭은 아직 만들지 않았다.

공통 필터: measurement_version=service_v1, traffic_class=production, 호스트 ^(www\.)?restorystudio\.co\.kr$.
측정 시작은 신규 배포 완료 시점이다. 예전 데이터에 상담 클릭/구간이 없었다고 0%로 소급 계산하지 않는다. 맞춤 기준 및 일반 보고서는 24~48시간 처리 지연이 있을 수 있다.

## 분석 기준

1. 서비스별 클릭률: **동일 service_id를 전체 퍼널에 필터링**하고, 폐쇄형 순차 사용자 퍼널 service_landing_view → service_contact_click 을 사용한다. 채널별은 두 번째 단계에만 channel=kakao 또는 phone 조건을 추가한다. 전체 퍼널에 channel을 걸면 방문 이벤트가 제외되어 분모가 망가진다. 모바일은 기기 카테고리=mobile 필터.
2. 여러 서비스가 섞인 탐색의 서비스별 세분화만으로 교차 서비스 방문을 정확히 귀속했다고 단정하지 않는다. 정확한 페이지별 비교는 서비스 필터별 동일 기간 퍼널 결과를 병렬 표로 정리한다. 일별 고유 사용자를 합쳐 기간 고유 사용자라고 부르지 않는다.
3. 구간별 진행: 동일 서비스/경로/구간 필터에서 section_view → section_progress의 순차 사용자 퍼널 또는 노출/진행 이벤트를 비교한다. 진행 이벤트는 이미 본 동일 구간에 대해서만 발생한다. 여러 방문이 섞이는 기간 사용자 비율과 방문 단위 노출 이벤트 비율을 구분한다.
4. section_progress 없는 노출은 '관측된 후속 진행 없음'이다. 다른 탭 이동, 이후 재방문, 수집 차단 등을 포함할 수 있어 정확한 이탈 위치라고 하지 않는다. 강제 선형 구간 퍼널은 건너뛰기를 이탈로 표시할 수 있으므로 별도로 해석한다.
5. 카카오+전화 사용자는 중복될 수 있다. 두 채널 클릭 사용자 합을 전체 상담 사용자로 사용하지 않는다.
6. 이벤트/맞춤 기준이 아직 처리되지 않았거나 행이 없으면 산출 불가/집계 대기라고 보고한다. Supermetrics에서 맞춤 기준과 순차 퍼널 지원을 확인하지 못한 항목은 GA4 탐색 UI에서 확인한다.

## 실제 경로와 구간

- `/kitchen/sink-door` → `sink-door`: hero → cases → budget → timeline → colors → materials → photo_guide → warranty → faq → contact → reviews
- `/repair/sangbujang` → `sangbujang`: hero → budget → cases → scope → warranty → photo_guide → video → faq → contact
- `/repair/habujang` → `habujang`: hero → cases → scope → budget → photo_guide → faq → contact
- `/repair/sink-top-crack` → `sink-top-crack`: hero → budget → cases → scope → warranty → photo_guide → faq → contact
- `/sofa` → `sofa-sag`: hero → cases → scope → process → budget → video → faq → contact
- `/kitchen/fridge-cabinet` → `fridge-cabinet`: hero → service_overview → cases → colors → reviews → process → warranty → video → faq → contact
- `/kitchen/rocheong` → `rocheong`: hero → problems → process
- `/leather/restaurant-chair` → `restaurant-chair`: hero → cases → colors → reviews → process → warranty → video → faq → contact
- `/leather/meeting-table` → `meeting-table`: hero → cases → colors → reviews → process → warranty → video → faq → contact
- `/leather` → `leather`: hero → services
- `/kitchen` → `kitchen`: hero → services
- `/repair` → `repair`: hero → services

지역 파생 경로는 위 공유 템플릿의 대표 service_id를 사용한다. 비활성 /repair/sofa-sag, /leather/restaurant-sofa 대표 경로는 기존 설정상 404이고 신규로 활성화하지 않았다. 실제 소파 서비스는 /sofa → sofa-sag.

## 검증

- node --test scripts/service-analytics.test.mjs scripts/academy-attribution.test.mjs: 47/47.
- 프로덕션 빌드 및 TypeScript 검사 통과.
- 변경 파일 ESLint 오류 0; 기존 미사용 변수/이미지 관련 경고 8개.
- HTTP 경로 검사: 활성 서비스 12개와 기살/상담 200, 비활성 2개 기존 404.
- 테스트는 네트워크 없는 실제 effect 실행과 분석/DB/상담 목적지를 차단한 로컬 브라우저에서 실시. 운영 실제 수집을 합성 이벤트로 검증하지 않음.
- 본문/스타일/가격/A/S/기살 상담 로직은 변경하지 않음. JSX 인용부호 4개만 동일 출력의 &quot;로 정리.

- 모바일 390px: 주요 서비스 9개에서 가로 넘침 없음, H1 1개 및 상담 링크/구간 표식 확인. PC 1440px 대표 문짝 페이지 확인. 외부 영상은 QA CSP로 의도적으로 차단.
