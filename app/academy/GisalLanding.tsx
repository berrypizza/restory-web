import Link from "next/link";
import { EnrollButton, EnrollmentProvider } from "./EnrollmentDialog";
import AcademyTracking from "./AcademyTracking";
import AcademyStage from "./AcademyStage";
import HeaderGlass from "./HeaderGlass";
import AcademyQuestion from "./AcademyQuestion";
import AcademyChaos from "./AcademyChaos";
import AcademyEssence from "./AcademyEssence";
import AcademyFooter from "./AcademyFooter";
import AcademyRoots from "./AcademyRoots";
import styles from "./gisal.module.css";

function cx(names: string) { return names.split(" ").map(name => styles[name]).join(" "); }

export default function GisalLanding() {
  return <EnrollmentProvider>

  <AcademyTracking />
  <a href="#main" className={cx("skip-link")}>본문으로 건너뛰기</a>
  <HeaderGlass />
  <header className={cx("header")} data-gisal-header>
    <div className={cx("wrap nav")}>
      <div className={cx("brandCollab")}>
        <a className={cx("brand")} href="#main" aria-label="기술로 살아남기 홈"><span className={cx("brand-mark")}>기살<span>.</span></span></a>
        <span className={cx("collabCross")} aria-hidden="true">×</span>
        <Link className={cx("restoryBrand")} href="/" aria-label="Restory 리스토리 메인으로 이동">Restory</Link>
      </div>
      <EnrollButton className={cx("nav-cta")} />
    </div>
  </header>
  <main id="main" data-service-id="academy">
    <AcademyStage />
    <AcademyQuestion />
    <AcademyChaos />
    <AcademyEssence />
    <AcademyRoots />
  </main>
  <AcademyFooter />


  </EnrollmentProvider>;
}
