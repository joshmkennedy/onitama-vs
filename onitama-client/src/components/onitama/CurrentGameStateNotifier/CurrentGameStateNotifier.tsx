import { useAtom } from "jotai";
import styles from "./CurrentGameStateNotifier.module.css";
import { gameStateStore, playerInfoStore } from "../state";
import { useCallback, useEffect, useRef, useState } from "react";

const PLAYER_TURN = "PLAYER_TURN";
const WAITING = "WAITING_FOR_OTHER_PLAYER";
const WON = "YOU_WON";
const LOST = "YOU_LOST";

// type is a union of all the possible states
type STATES = typeof PLAYER_TURN | typeof WAITING | typeof WON | typeof LOST;

const messageTimes: Record<STATES, number> = {
  [PLAYER_TURN]: 2000,
  [WAITING]: 2000,
  [WON]: Infinity,
  [LOST]: Infinity,
};

const RED = 1;

export default function CurrentGameStateNotifier({
  winner,
}: {
  winner: 1 | 2 | 0;
}) {
  const [gameState] = useAtom(gameStateStore);
  const [playerInfo] = useAtom(playerInfoStore);
  const currentPlayer = gameState?.currentPlayer;
  const thisPlayer = playerInfo?.playerId ?? 0;

  const [currentMessage, setCurrentMessage] = useState<STATES | undefined>(
    undefined,
  );

  const currentColor = currentPlayer === 1 ? "red" : "blue";

  const playerColor = thisPlayer === RED ? "red" : "blue";
  const otherColor = thisPlayer === RED ? "blue" : "red";

  const timer = useRef<NodeJS.Timeout | null>(null);
  const dissmiss = useCallback(
    function dissmiss() {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setCurrentMessage(undefined);
    },
    [setCurrentMessage],
  );

  useEffect(() => {
		console.log("winner state = ", winner)
    const isPlayerTurn = currentPlayer === thisPlayer;
    if (winner > 0) {
			if(timer.current) {
				clearTimeout(timer.current)
			}
      setCurrentMessage(winner == thisPlayer ? WON : LOST);
    } else {
      if (isPlayerTurn) {
        setCurrentMessage(PLAYER_TURN);
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          setCurrentMessage(undefined);
        }, messageTimes[PLAYER_TURN]);
      } else if (!isPlayerTurn) {
        setCurrentMessage(WAITING);
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          setCurrentMessage(undefined);
        }, messageTimes[WAITING]);
      }
    }
  }, [currentPlayer, setCurrentMessage, winner, thisPlayer]);

  if (currentMessage) {
    return (
      <div className={styles.currentGameStateNotifier}>
        {currentMessage === PLAYER_TURN ? (
          <div className={`${styles.contents} ${styles.turn}`}>
            <p className={`${currentColor}-text`}>{currentColor}</p>
            <h3>Your turn</h3>
          </div>
        ) : null}
        {currentMessage === WAITING ? (
          <div className={`${styles.contents} ${styles.turn}`}>
            <p className={`${currentColor}-text`}>{currentColor}</p>
            <h3>Waiting for other player</h3>
          </div>
        ) : null}
        {currentMessage === WON ? (
          <div className={`${styles.contents} ${styles.endGame}`}>
            <button onClick={dissmiss} className="close abs-tr">
              &times;
            </button>
            <p className={`${playerColor}-text`}>{playerColor} Won!</p>
            <h3>Dude You Won!</h3>
            <p>
              You did it! You have defeated the{" "}
              <span className={`${otherColor}-text`}>{otherColor}</span> side,
              and your country is safe again!
            </p>
          </div>
        ) : null}
        {currentMessage === LOST ? (
          <div className={`${styles.contents} ${styles.endGame}`}>
            <button onClick={dissmiss} className="close abs-tr">
              &times;
            </button>
            <p className={`${otherColor}-text`}>{otherColor} Won 😢</p>
            <h3>All is lost</h3>
            <p>
              Your captain is a loser, and the{" "}
              <span className={`${otherColor}-text`}>{otherColor}</span> side is
              victorious!
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}
