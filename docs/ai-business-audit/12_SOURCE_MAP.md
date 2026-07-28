# 소스 맵

| 파일 경로 | 파일 역할 | 들어 있는 데이터 | 연결 페이지 | 서비스 데이터 | 사례 데이터 | 가격 데이터 | SEO 데이터 | 수정 시 영향 |
|---|---|---|---|---|---|---|---|---|
| lib/site-config.ts | 사업 라인/서비스 기본 데이터 | 서비스명, 설명, hero, painPoints, process | /repair, /kitchen, /leather, /sofa 및 하위 페이지 | 예 | 아니오 | 일부 문구 | 일부 | 서비스 페이지 전반 |
| lib/case-data.tsx | 사례 원본 데이터 | 사례 ID, 제목, 지역, 요약, 본문, 이미지, 태그 | /cases, /cases/[id] | 간접 | 예 | 대부분 없음 | 태그 | 사례 페이지/사이트맵 |
| lib/seo-regions.ts | 지역 키워드 | 지역 목록 | SEO 랜딩 | 아니오 | 아니오 | 아니오 | 예 | 지역 페이지 생성 범위 |
| lib/keyword-slugs.ts | 키워드 슬러그 | 서비스/지역/증상 키워드 조합 | /repair/[slug], /kitchen/[slug], /leather/[slug], /sofa/[slug] | 간접 | 아니오 | 비용 키워드 포함 | 예 | 사이트맵/동적 페이지 수 |
| lib/tips/index.ts | 팁 콘텐츠 등록 | 팁 목록 export | /tips, /tips/[id] | 간접 | 아니오 | 일부 | 예 | 팁 페이지 목록 |
| lib/tips/contents/*.ts | 팁 본문 | 정보성 콘텐츠, 태그, 썸네일 | /tips/[id] | 일부 | 아니오 | 일부 | 예 | 팁 상세 페이지 |
| app/sitemap.ts | 사이트맵 생성 | 정적/키워드/사례 URL | /sitemap.xml | 간접 | 예 | 아니오 | 예 | 검색엔진 제출 URL |
| app/robots.ts | robots 설정 | 크롤링 정책 | /robots.txt | 아니오 | 아니오 | 아니오 | 예 | 검색엔진 접근 |
| app/layout.tsx | 전역 metadata/layout | title, description, OG, robots, LocalBusinessJsonLd | 전체 | 아니오 | 아니오 | 아니오 | 예 | 전체 SEO/브랜드 표기 |
| app/components/ContactCTA.tsx | 문의 CTA | 문의 버튼/문구 | 여러 페이지 | 아니오 | 아니오 | 아니오 | 전환 | 전환 UI |
| app/components/BottomCTA.tsx | 하단 고정 CTA | 문의 유도 | 여러 페이지 | 아니오 | 아니오 | 아니오 | 전환 | 모바일 문의 전환 |
| app/admin/* | 내부 운영 화면 | 일정/자재/기사 UI | /admin | 아니오 | 아니오 | 일부 운영 | 아니오 | 관리자 기능 |
