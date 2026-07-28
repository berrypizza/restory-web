# 리스토리 스튜디오 AI 사업 분석 자료

- 프로젝트명: restory-web / 리스토리 스튜디오 운영 웹사이트
- 현재 Git commit hash: `2ca5275701b228d80e42a31ccf5852a615d93095`
- 생성 날짜: 2026-07-26T02:30:29+09:00
- 생성 위치: `docs/ai-business-audit/`

## 목적

이 자료는 리스토리 스튜디오 웹사이트의 사업 구조, 서비스, 시공 사례, SEO 구조, 문의 전환 구조를 ChatGPT가 읽기 쉽게 분석하기 위한 읽기 전용 자료입니다. 운영 코드와 원본 데이터는 수정하지 않았고, 결과물은 이 폴더 안에만 생성했습니다.

## 확인한 주요 폴더

- `app/`: Next.js App Router 페이지, API, 공통 컴포넌트
- `lib/`: 서비스, 사례, 지역, 키워드, 팁 콘텐츠 데이터
- `public/images/`: 이미지 경로만 참고, 원본 이미지는 결과물에 포함하지 않음

## 분석에 사용한 데이터 파일

- `lib/case-data.tsx`
- `lib/site-config.ts`
- `lib/landing-config.ts`
- `lib/seo-regions.ts`
- `lib/keyword-slugs.ts`
- `lib/tips/index.ts`
- `lib/tips/contents/*.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/layout.tsx`

## 추천 파일 열람 순서

1. `01_BUSINESS_SUMMARY.md`
2. `02_SITE_STRUCTURE_AND_FUNNEL.md`
3. `03_SERVICES.json`
4. `04_CASES_SUMMARY.csv`
5. `06_CONTENT_AND_SEO_INVENTORY.csv`
6. `08_CONVERSION_AUDIT.md`
7. `10_GAPS_AND_QUESTIONS.md`

## 누락됐거나 확인할 수 없는 데이터

- 실제 문의 수, 예약률, 매출, 자재비, 광고비, 고객별 상담 로그는 저장소에서 확인 불가
- 작업별 실제 가격, 실제 시공 시간, 제작 기간은 일부 문구 외 구조화 데이터 없음
- Search Console, Analytics, Lighthouse 실측 데이터 없음
- 카카오톡 실제 상담 전환 데이터 확인 불가
