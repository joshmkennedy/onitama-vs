import { useEffect } from "react";

let ws: WebSocket | undefined;

export type WSConfigSettings = {
  gameKind: "singleplayer" | "mulitplayer";
};

export function useWS({
  messageHandler,
  info,
}: {
  messageHandler: (msg: any) => void;
  info: WSConfigSettings;
}) {
  useEffect(() => {
    if (!ws) {
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
      const gameId = new URLSearchParams(window.location.search).get("gameId");
      const host = process.env.NEXT_PUBLIC_BACKEND_URL;
      ws = new WebSocket(host + `/ws?gameId=${gameId}&kind=${info.gameKind}`);
    }
    if (ws) {
      ws.onmessage = messageHandler;
      ws.onclose = function () {
        ws = undefined;
      };
      ws.onopen = function () {
        console.log("OPENED CONNECTION");
      };
    }
    return () => {
      ws?.close(1000, "Client closing connection");
    };
  }, [messageHandler, info.gameKind]);

  return ws;
}
