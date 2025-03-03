import styles from "../Tile/Tile.module.css";
export function Player1CaptainUnit() {
	return (
		<svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
			<mask
				id="mask0_1_2"
				style={{ maskType: "alpha" }}
				maskUnits="userSpaceOnUse"
				x="8"
				y="75"
				width="234"
				height="165"
			>
				<rect x="8" y="75" width="234" height="165" rx="37" fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask0_1_2)">
				<rect x="8" y="75" width="234" height="165" rx="37" fill="#C22121" />
				<rect y="183" width="250" height="100" fill="#7F0303" />
				<rect y="186" width="122" height="108" fill="#A90101" />
				<rect x="131" y="186" width="119" height="108" fill="#A90101" />
				<g className={styles.arms}>
					<rect
						x="-43"
						y="127"
						width="127"
						height="48"
						rx="20"
						fill="#A90101"
						className="right-arm"
					/>
					<rect
						x="89"
						y="125"
						width="178"
						height="48"
						rx="20"
						fill="#A90101"
						className="left-arm"
					/>
				</g>
				<ellipse cx="28.5" cy="76.5" rx="33.5" ry="32.5" fill="#7F0303" />
				<ellipse cx="221.5" cy="76.5" rx="33.5" ry="32.5" fill="#7F0303" />
			</g>
			<mask
				id="mask1_1_2"
				style={{ maskType: "alpha" }}
				maskUnits="userSpaceOnUse"
				x="66"
				y="11"
				width="117"
				height="88"
			>
				<rect x="66" y="11" width="117" height="88" rx="23" fill="#A90101" />
			</mask>
			<g mask="url(#mask1_1_2)" className={styles.head}>
				<rect x="66" y="11" width="117" height="88" rx="23" fill="#A90101" />
				<rect x="106.047" width="36.1208" height="55" fill="#C22121" />
				<rect x="116.255" width="15.7047" height="43" fill="#5F0505" />
				<rect
					x="88.7718"
					y="60"
					width="25.1275"
					height="15"
					rx="5"
					fill="#7F0303"
				/>
				<rect
					x="135.886"
					y="60"
					width="25.1275"
					height="15"
					rx="5"
					fill="#7F0303"
				/>
				<rect x="103.691" y="83" width="41.6175" height="8" fill="#5F0505" />
				<rect
					x="96.1601"
					y="52"
					width="24"
					height="4.68001"
					rx="2.34001"
					transform="rotate(27.488 96.1601 52)"
					fill="#5F0505"
				/>
				<rect
					x="132.86"
					y="63"
					width="24"
					height="4.68001"
					rx="2.34001"
					transform="rotate(-27.04 132.86 63)"
					fill="#5F0505"
				/>
			</g>
			<g className={styles.sword}>
				<rect x="47" y="20" width="14" height="113" rx="7" fill="#5F0505" />
				<rect x="33" y="125" width="40" height="8" rx="4" fill="#5F0505" />
			</g>
		</svg>
	);
}
