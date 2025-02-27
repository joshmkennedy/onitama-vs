"use client";

import { useCallback, useState } from "react";
import "./App.css";
import Board from "./Board";
import Header from "./Header";
import Help from "./Help";
import { useWS } from "./ws";
import { Position } from "./types";
import { gameInfoStore, gameStateStore, playerInfoStore } from "./state";
import { useAtom } from "jotai";
import { WaitingRoom } from "./WaitingRoom";

function App() {
  const [isHelpShowing, setIsHelpShowing] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | 0>(0);
  function showWinner(winner: 1 | 2 | 0) {
    setWinner(winner);
  }

  const [gameState, setGameState] = useAtom(gameStateStore);

  const [playerInfo, setPlayerInfo] = useAtom<
    | {
        playerId: number;
      }
    | undefined
  >(playerInfoStore);

  const [gameInfo, setGameInfo] = useAtom<
    { gameId: string; playerCount: number } | undefined
  >(gameInfoStore);

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
    [setGameState, setWinner, setPlayerInfo, setGameInfo],
  );
  const ws = useWS(messageHandler);

  function playTurn(
    selectedPos: Position,
    selectedCard: number,
    selectedUnit: number,
  ) {
    ws.send(
      JSON.stringify({
        type: "playTurn",
        payload: { selectedCard, selectedPosition: selectedPos, selectedUnit },
      }),
    );
  }
  function resetGame() {
    ws.send(
      JSON.stringify({
        type: "newGame",
        payload: {},
      }),
    );
  }


  return (
    <>
      {/* HElP MODAL */}
      {isHelpShowing ? <Help close={() => setIsHelpShowing(false)} /> : null}

      {/* WAITING ROOM */}
      {gameInfo && playerInfo && gameInfo.playerCount < 2 ? (
        <WaitingRoom playerId={playerInfo?.playerId} />
      ) : null}

      {/* GAME */}
      {gameState && gameInfo && gameInfo.playerCount >= 2 ? (
        <div className="App">
          <Header
            winner={winner}
            newGame={resetGame}
            showHelp={() => setIsHelpShowing(true)}
          />
          <Board playTurn={playTurn} />
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
