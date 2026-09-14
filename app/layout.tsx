import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutBody from "@/app/components/LayoutBody";
import Footer from "./components/Footer";
import { LocalBusinessJsonLd } from "@/app/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1f66ff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.restorystudio.co.kr"),
  title: {
    default: "리스토리 Re'Story - 가구 출장 수리 리폼 전문",
    template: "%s | 리스토리 Re'Story",
  },
  description:
    "싱크대 수리·리폼, 의자 가죽 교체, 소파 복원 전문. 사진 한 장으로 견적 바로 확인. 서울·경기·인천 출장.",
  keywords: [
    "싱크대 상부장 수리",
    "싱크대 문짝 교체",
    "싱크대 리폼",
    "식당 의자 가죽 교체",
    "소파 쿠션 복원",
    "가구 수리",
    "가구 출장 수리",
    "리스토리",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "리스토리 Re'Story",
    title: "리스토리 Re'Story - 가구 출장 수리 리폼 전문",
    description:
      "싱크대 수리, 싱크대 리폼, 의자 가죽 교체, 소파 복원. 사진만 보내면 견적 바로 안내.",
    url: "https://www.restorystudio.co.kr",
    images: [
      {
        url: "/images/og-image-2.png",
        width: 1200,
        height: 630,
        alt: "리스토리 - 가구 출장 수리 전문",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    other: {
      "naver-site-verification": "3288ff0c6f87e7e15824dbedaaca27b257b15010",
    },
  },
  alternates: {
    canonical: "https://www.restorystudio.co.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.1/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"
        />
      </head>
      <body
        style={{
          backgroundColor: "#fff",
          fontFamily:
            "'Wanted Sans Variable', 'Wanted Sans', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        }}>
        <LocalBusinessJsonLd />
        <LayoutBody>{children}</LayoutBody>
        <Footer />
        <Analytics />

        <GoogleAnalytics gaId="G-ZT8HRBBXVR" />
        <Script
          id="acecounter-mobile-vars"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
var m_id = '';
var m_ag = 0;
var m_mr = '';
var m_gd = '';
var m_skey = '';
var m_jn = '';
var m_jid = '';
var m_ud1 = '';
var m_ud2 = '';
var m_ud3 = '';
`,
          }}
        />
        <Script
          id="acecounter-gathering"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
var _AceGID=(function(){var Inf=['restorystudio.co.kr','www.restorystudio.co.kr,restorystudio.co.kr,m.restorystudio.co.kr','AZ1A106207','1','NaPm,Ncisy','1']; var _CI=(!window._AceGID)?[]:window._AceGID.val;var _N=0;if(_CI.join('.').indexOf(Inf[2])<0){ _CI.push(Inf);  _N=_CI.length; } return {o: _N,val:_CI}; })();
var _AceCounter=(function(){var G=_AceGID;var _sc=document.createElement('script');var _sm=document.getElementsByTagName('script')[0];if(G.o!=0){var _A=G.val[G.o-1];var _U=(_A[4]).replace(/\\,/g,'_');_sc.src='https:/'+'/cr.acecounter.com/ac.j'+'s?gc='+_A[2]+'&py='+_A[1]+'&up='+_U+'&rd='+(new Date().getTime());_sm.parentNode.insertBefore(_sc,_sm);return _sc.src;}})();
`,
          }}
        />
      </body>
    </html>
  );
}
