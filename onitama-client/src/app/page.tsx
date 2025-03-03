import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1 className={styles.title}>
					<span className={styles.top}>Onitama</span>
					<span className={styles.bottom}>vs</span>
				</h1>
				<div className={styles.menu}>
					<nav className={styles.nav}>
						<Link className={styles.link} href="/game-single">Play Single Player</Link>
						<Link className={styles.link} href="/game">Play Multiplayer</Link>
						<Link className={`${styles.link} ${styles.secondary}`} href="/about">How to Play</Link>
					</nav>
				</div>
			</main>
		</div>
	);
}
