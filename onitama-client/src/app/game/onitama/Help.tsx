import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const boardLayoutImage = "/board-layout.png";
const basesImage = "/Bases.png";
const moveHintsImage = "/Move-Hints-Squares.png";
const PlayTurnButtonImage = "/Play-turn-button.png";
const PlayTurnWalkthrough = "/Play-Turn-Walkthrough.png";
const CaptainUnit = "/Player1-captain.png";
const PawnUnit = "/Player1-pawn.png";
const WinCaptureCaptain = "/Win-Capture-Captain.png";
const WinCaptureBase = "/Win-Capture-Base.png";

export default function Help({ close }: { close: () => void }) {
  const [i, setI] = useState<number>(0);
  const next = () => setI((prev) => (prev + 1) % slides.length);
  const prev = () => setI((prev) => (prev == 0 ? slides.length - 1 : prev - 1));
  const Current = slides[i];
  return (
    <div className="help">
      <h2>How to play</h2>
      <button className="close" onClick={close}>
        &times;
      </button>
      <div className="slider">
        <AnimatePresence>
          <Current />
        </AnimatePresence>
      </div>
      <div className="Help__button-row">
        <button onClick={prev}>Previous</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}
const motionSettings = {
  initial: { opacity: 0, x: -200 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0 },
};
const slides = [
  () => (
    <motion.div {...motionSettings} key={1} className="slide">
      <h3>Overview</h3>
      <div className="image">
        <img src={boardLayoutImage} />
      </div>
      <p>
        Onitama is a two player game, where players take turn choosing from 2
        cards that will move their units around the game board.
      </p>
    </motion.div>
  ),

  () => (
    <motion.div {...motionSettings} key={2} className="slide">
      <h3>Units</h3>
      <div className="flex-row">
        <div className="image">
          <img src={CaptainUnit} />
          <p>Player 1 Captain</p>
        </div>
        <div className="image">
          <img src={PawnUnit} style={{ width: ` 50%` }} />
          <p>Player 1 Pawn</p>
        </div>
      </div>
    </motion.div>
  ),

  () => (
    <motion.div className="slide" {...motionSettings} key={3}>
      <h3>Bases</h3>
      <div className="image">
        <img src={basesImage} />
      </div>
    </motion.div>
  ),

  () => (
    <motion.div className="slide" {...motionSettings} key={4}>
      <h3>The Players Turn</h3>
      <div className="image">
        <img src={PlayTurnWalkthrough} />
      </div>
      <p>
        One the players turn. They will first select the card they wish to use
        from their side of the board. Then they will choose the unit they wish
        to move using the selected card. After they have chosen the unit, the
        player will select a position to move to. Finally they will click the
        "Take Turn" button to confirm their move. It will then be the next
        players turn.
      </p>
    </motion.div>
  ),

  () => (
    <motion.div className="slide" {...motionSettings} key={5}>
      <h3>Win Conditions</h3>
      <div className="flex-row">
        <div className="image">
          <img src={WinCaptureCaptain} />
          <p>Capture Opponent Captain</p>
        </div>
        <div className="image">
          <img src={WinCaptureBase} />
          <p>Capture Opponent Base</p>
        </div>
      </div>
      <p>
        You can win by either capturing the opponent's Captain or by Capturing
        their base.
      </p>
    </motion.div>
  ),
];
