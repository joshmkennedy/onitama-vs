import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
				<Link href="/api/new-game" className={styles.newGameLink}>New Game</Link>
			</main>
    </div>
  );
}
