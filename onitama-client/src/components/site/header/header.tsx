import Link from "next/link";
import styles from "./header.module.css";
import Logo from "../logo/logo";
export default function Header() {
  return (
    <header className={styles.siteHeader}>
			<Logo />
      <nav className={styles.navigation}>
        <Link href="/about">How to Play</Link>
      </nav>
    </header>
  );
}
