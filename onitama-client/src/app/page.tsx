import {LogoTitle} from "@/components/site/logo/logo";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<LogoTitle />
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
