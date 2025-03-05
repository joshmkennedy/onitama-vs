import Link from "next/link";
import styles from "./logo.module.css";
export default function Logo() {
  return (
    <Link href="/">
      <div className={styles.logo}>
        <span className={styles.top}>Onitama</span>
        <span className={styles.bottom}>vs</span>
      </div>
    </Link>
  );
}

export function LogoTitle() {
  return (
    <h1 className={styles.title}>
      <span className={styles.top}>Onitama</span>
      <span className={styles.bottom}>vs</span>
    </h1>
  );
}
