"use client";
import { useEffect } from "react";

const gameId =
  typeof window != "undefined" &&
  new URLSearchParams(window.location.search).get("gameId");
let ws: WebSocket;
export function useWS(messageHandler: (msg: any) => void) {
  useEffect(() => {
    if (!gameId) {
      console.log("No game Id Found will be given a new one");
    }
    if (!ws) {
			console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
      const host =
        process.env.NODE_ENV == "development"
          ? "192.168.68.112:8080"
          : process.env.NEXT_PUBLIC_BACKEND_URL;
      ws = new WebSocket("ws://" + host + "/ws?gameId=" + gameId);
    }
    if (ws) {
      ws.onmessage = messageHandler;
      ws.onclose = function () {
        console.log("CLOSED CONNECTION");
      };
      ws.onopen = function () {
        console.log("OPENED CONNECTION");
      };
    }
  }, [messageHandler]);
  return ws;
}
