import { useRef } from "react";
import { RefreshCw, Home, LifeBuoy, X } from "@geist-ui/icons";
import styles from "./Menu.module.css";
import Link from "next/link";

export default function Menu({
	newGame: _newGame,
	showHelp: _showHelp,
}: {
	newGame: () => void;
	showHelp: () => void;
}) {
	const menuRef = useRef<HTMLDialogElement>(null);
	const newGame = () => {
		menuRef.current?.close();
		_newGame();
	};
	const showHelp = () => {
		menuRef.current?.close();
		_showHelp();
	};
	return (
		<>
			<button
				onClick={() => menuRef.current?.showModal()}
				className={styles.menuButon}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="white"
					width="24"
				>
					<circle cx="4" cy="12" r="2" />
					<circle cx="12" cy="12" r="2" />
					<circle cx="20" cy="12" r="2" />
				</svg>
			</button>

			<dialog ref={menuRef} className={styles.menu}>
				<button
					className={styles.menuClose}
					onClick={() => menuRef.current?.close()}
				>
					<X />
				</button>
				<div className={styles.menuContent}>
					<h2 className={styles.menuTitle}>Menu</h2>
					<button className={styles.menuItem} onClick={newGame}>
						<div className={styles.menuItemIcon}>
							<RefreshCw />
						</div>
						<div className={styles.menuItemText}>New Game</div>
					</button>
					<Link href="/" className={styles.menuItem}>
						<div className={styles.menuItemIcon}>
							<Home />
						</div>
						<div className={styles.menuItemText}>Home</div>
					</Link>
					<button className={styles.menuItem} onClick={showHelp}>
						<div className={styles.menuItemIcon}>
							<LifeBuoy />
						</div>
						<div className={styles.menuItemText}>Help</div>
					</button>
				</div>
			</dialog>
		</>
	);
}
