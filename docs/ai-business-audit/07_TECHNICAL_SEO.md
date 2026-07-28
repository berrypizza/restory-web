# 기술 SEO 점검

## 확인 내용

- 프레임워크: Next.js 16.2.6, React 19.2.4. 출처: `package.json`
- App Router: 사용. 출처: `app/` 디렉터리 구조
- SSG: 사례, 팁, 키워드 동적 페이지에서 generateStaticParams 사용 흔적 확인
- SSR/동적 API: `app/api/directions`, `app/api/geocode`, `app/api/kakao-chatbot`
- sitemap: `app/sitemap.ts`에서 정적 페이지, 키워드 페이지, 사례 페이지 생성
- robots.txt: `app/robots.ts` 존재
- metadata: `app/layout.tsx`와 각 페이지 metadata/generateMetadata에서 설정 가능
- Open Graph: `app/layout.tsx` 확인
- Twitter Card: 저장소 전체 기준 명시 설정 여부 확인 필요
- 구조화 데이터: `app/components/JsonLd.tsx`, `LocalBusinessJsonLd` 사용
- 지역 페이지 생성: `lib/seo-regions.ts`, `lib/keyword-slugs.ts` 조합
- 서비스 페이지 생성: `lib/site-config.ts`, `app/[category]/[slug]/page.tsx` 계열
- 사례 페이지 생성: `lib/case-data.tsx`, `app/cases/[id]/page.tsx`
- 싱크대/씽크대 유사 키워드: `lib/keyword-slugs.ts`에 둘 다 포함
- 실측 데이터: Lighthouse, Search Console, Analytics 성능 결과는 저장소만으로 확인 불가

## 문제 1

문제: 키워드 랜딩 페이지가 대량 생성되어 중복 콘텐츠 리스크가 있습니다.
근거: `lib/keyword-slugs.ts`와 `app/sitemap.ts`에서 지역+서비스 조합 다수 생성.
영향: 검색엔진이 유사 페이지를 낮게 평가할 수 있음.
권장 수정: 지역 페이지별 실제 사례, 지역 문장, FAQ 차이를 늘려 중복률을 낮추기.
관련 파일: `lib/keyword-slugs.ts`, `app/sitemap.ts`, `app/repair/[slug]/page.tsx`, `app/kitchen/[slug]/page.tsx`

## 문제 2

문제: 가격 정보가 구조화 데이터로 충분히 관리되지 않습니다.
근거: 서비스 데이터에는 process와 painPoints는 있으나 price 필드는 없음.
영향: 가격 검색 의도를 가진 고객의 전환 설득이 약해질 수 있음.
권장 수정: 조건별 가격 범위, 제외 조건, 사진 확인 후 변동 사유를 별도 데이터로 관리.
관련 파일: `lib/site-config.ts`, 서비스 페이지 컴포넌트

## 문제 3

문제: 이미지 alt 품질은 실제 렌더링 기준 추가 검증이 필요합니다.
근거: 케이스 데이터는 이미지 경로만 보유하고 alt는 페이지 컴포넌트에서 생성될 가능성이 큼.
영향: 이미지 검색과 접근성 최적화 기회 손실.
권장 수정: 사례 데이터에 before/after alt 필드 추가.
관련 파일: `lib/case-data.tsx`, `app/cases/[id]/page.tsx`

## 문제 4

문제: 일부 서비스 가능 지역과 실제 운영 범위가 SEO 키워드 범위와 다를 수 있습니다.
근거: `lib/seo-regions.ts`는 키워드용 지역 목록이며 실제 현장 가능 지역/등급 데이터는 별도 구조화되어 있지 않음.
영향: 문의 품질 저하 또는 이동 거리 높은 문의 증가.
권장 수정: 지역 등급, 가능/제한 조건, 고단가만 가능 지역을 별도 데이터화.
관련 파일: `lib/seo-regions.ts`

## 문제 5

문제: 깨진 링크/이미지 경로는 정적 분석만으로 완전 검증하지 못했습니다.
근거: 이미지 원본은 결과물에 포함하지 않았고 경로 문자열만 수집.
영향: 사례 페이지 전후 사진 누락 시 전환 설득 약화.
권장 수정: 빌드 시 public 이미지 경로 존재 여부를 검사하는 스크립트 추가.
관련 파일: `lib/case-data.tsx`, `public/images`
