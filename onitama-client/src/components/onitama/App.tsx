"use client";
import { useCallback, useState } from "react";
import { useAtom } from "jotai";

import { Position } from "./types";
import {
  gameInfoStore,
  gameStateStore,
  normalizedTurn,
  playerInfoStore,
} from "./state";
import { useWS, WSConfigSettings } from "./ws";

import "./App.css";
import Board from "./Board/Board";
import Header from "./Header/Header";
import Help from "./Help/Help";
import { WaitingRoom } from "./WaitingRoom/WaitingRoom";
import CurrentGameStateNotifier from "./CurrentGameStateNotifier/CurrentGameStateNotifier";

function App({
  wsSettings,
  skipWaitingRoom = false,
}: {
  skipWaitingRoom?: boolean;
  wsSettings: WSConfigSettings;
}) {
  const [isHelpShowing, setIsHelpShowing] = useState(false);

  const [winner, setWinner] = useState<1 | 2 | 0>(0);
  function showWinner(winner: 1 | 2 | 0) {
    setWinner(winner);
  }
  const [gameState, setGameState] = useAtom(gameStateStore);
  const [playerInfo, setPlayerInfo] = useAtom(playerInfoStore);
  const inversedBoard = playerInfo?.playerId == 1;
  const [gameInfo, setGameInfo] = useAtom(gameInfoStore);

  const messageHandler = useCallback(
    (message: any) => {
      const data = JSON.parse(message.data);
      console.log("Handling Event: ", data.type);
      if (data.type == "gameState") {
        setGameState(data.payload);
      }
      if (data.type == "newGame") {
        setWinner(0);
        setGameState(data.payload);
      }

      if (data.type == "gameInfoUpdate") {
        setGameInfo(data.payload);
      }

      if (data.type == "endGame") {
        setGameState(data.payload.finalGameState);
        setTimeout(() => showWinner(data.payload.winner));
      }

      if (data.type == "welcome") {
        setPlayerInfo(data.payload.playerInfo);
        setGameInfo(data.payload.gameInfo);
        updateGameIdParam(data.payload.gameInfo.gameId);
      }

      if (data.type == "message") {
        console.log(data.payload);
      }
    },
    [setWinner, setPlayerInfo, setGameInfo, setGameState],
  );
  const ws = useWS({ messageHandler, info: wsSettings });

  function playTurn(
    selectedPos: Position,
    selectedCard: number,
    selectedUnit: number,
  ) {
    if (winner > 0) return;
    // TODO:
    // INVERSE if is player 1. since they on the bottom where p2 is supposed to
    // be at least in "PURE STATE"

    ws?.send(
      JSON.stringify({
        type: "playTurn",
        payload: normalizedTurn(
          { selectedCard, selectedPosition:selectedPos, selectedUnit },
          inversedBoard,
        ),
      }),
    );
  }

  function resetGame() {
    ws?.send(
      JSON.stringify({
        type: "newGame",
        payload: {},
      }),
    );
  }

  const currentPlayerIndicatorClass = `player-${gameState?.currentPlayer}-turn`;

  return (
    <>
      {/* HElP MODAL */}
      {isHelpShowing ? <Help close={() => setIsHelpShowing(false)} /> : null}

      {/* WAITING ROOM */}
      {!skipWaitingRoom &&
      gameInfo &&
      playerInfo &&
      gameInfo.playerCount < 2 ? (
        <WaitingRoom
          showHelp={() => setIsHelpShowing(true)}
          playerId={playerInfo?.playerId}
          newGame={resetGame}
        />
      ) : null}

      {/*For Singleplayer they just need a loading screen while we send them the game*/}
      {skipWaitingRoom && !gameState ? (
        <p style={{ textAlign: "center", marginTop: "20vh" }}>
          Loading Board...
        </p>
      ) : null}

      {/* GAME */}
      {gameState &&
      gameInfo &&
      (gameInfo.playerCount >= 2 || gameInfo.gameKind === "singleplayer") ? (
        <div
          className={`App ${currentPlayerIndicatorClass} ${inversedBoard ? "inversed-board" : ""}`}
        >
          <Header
            winner={winner}
            newGame={resetGame}
            showHelp={() => setIsHelpShowing(true)}
          />

          <Board playTurn={playTurn} isInversed={inversedBoard} />

          {/* Shows quick message when 
						- current player changes		
						- game ends
					*/}
          <CurrentGameStateNotifier winner={winner} />
        </div>
      ) : null}
    </>
  );
}

function updateGameIdParam(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("gameId", id);
  window.history.replaceState(null, "", url.toString());
}

export default App;
