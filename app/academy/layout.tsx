import AcademyNav from "./AcademyNav";
import styles from "./academy.module.css";

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.academy}>
      <AcademyNav />
      {children}
    </div>
  );
}
