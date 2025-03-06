import styles from "./about-page.module.css";
import Header from "../../components/site/header/header";
const boardLayoutImage = "/board-layout.png";
const basesImage = "/Bases.png";
const PlayTurnWalkthrough = "/playturn.png";
const CaptainUnit = "/Player1-captain.png";
const PawnUnit = "/Player1-pawn.png";
const WinCaptureCaptain = "/Win-Capture-Captain.png";
const WinCaptureBase = "/Win-Capture-Base.png";

export default function About() {
  return (
		<>
		<Header />
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>How To Play</h1>
        <p className={styles.intro}>
          Onitama is a two-player abstract strategy game where each player
          controls a Master and four Students on a 5x5 board. The objective is
          to either capture the opponent&apos;s Master or move your Master into the
          opponent&apos;s Temple Arch.
        </p>
      </div>

      <div className={styles.sectionContainer}>
        <div className={styles.flexRow}>
          <div className={styles.contentCol}>
            <h2 className={styles.subtitle}>Game Overview</h2>
            <p className={styles.paragraph}>
              Onitama is a two-player game where players take turns choosing
              from 2 cards that will move their units around the game board.
            </p>
          </div>
          <div className={styles.image}>
            <img alt="the board or grid of onitama" src={boardLayoutImage} />
          </div>
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <h2 className={`${styles.subtitle} ${styles.center}`}>Units</h2>
        <div className={`${styles.flexRow} ${styles.sqeeze}`}>
          <div className={styles.image}>
            <div className={styles.centerCol}>
              <img alt="The captain in onitama" src={CaptainUnit} />
              <p>Player 1 Captain</p>
            </div>
          </div>
          <div className={styles.image}>
            <div className={styles.centerCol}>
              <img
                src={PawnUnit}
                alt="the pawn in onitama"
                style={{ width: `50%` }}
              />
              <p>Player 1 Pawn</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <h2 className={styles.subtitle}>Bases</h2>
        <div className={`${styles.image} `} style={{ marginInline: "auto" }}>
          <img src={basesImage} alt="The base tile in onitama" />
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <div className={styles.flexRow}>
          <div className={styles.contentCol}>
            <h2 className={styles.subtitle}>The Player&apos;s Turn</h2>
            <p className={styles.paragraph}>
              On the player&apos;s turn, they will first select the card they wish to
              use from their side of the board. Then they will choose the unit
              they wish to move using the selected card. After they have chosen
              the unit, the player will select a position to move to. Finally,
              they will click the &ldquo;Confirm&ldquo; button to confirm their move. It
              will then be the next player&apos;s turn.
            </p>
          </div>
          <div className={styles.image}>
            <img
              src={PlayTurnWalkthrough}
              alt="An example of a turn in onitama"
            />
          </div>
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <h2 className={styles.subtitle}>Win Conditions</h2>
        <p className={`${styles.paragraph} ${styles.center}`}>
          You can win by either capturing the opponent&apos;s Captain or by capturing
          their base.
        </p>
        <div className={styles.flexRow}>
          <div className={styles.image}>
            <div className={styles.centerCol}>
              <p>Capture Opponent Captain</p>
              <img src={WinCaptureCaptain} alt="capturing team&apos;s captain" />
            </div>
          </div>
          <div className={styles.image}>
            <div className={styles.centerCol}>
              <p>Capture Opponent Base</p>
              <img
                alt="capturing the base win condition"
                src={WinCaptureBase}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
		</>
  );
}
