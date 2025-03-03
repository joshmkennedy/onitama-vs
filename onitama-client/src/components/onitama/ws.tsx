"use client";
import { useEffect } from "react";

const gameId =
	typeof window != "undefined" &&
	new URLSearchParams(window.location.search).get("gameId");
let ws: WebSocket;

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
		if (!gameId) {
			console.log("No game Id Found will be given a new one");
		}
		if (!ws) {
			console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
			const host = process.env.NEXT_PUBLIC_BACKEND_URL;
			ws = new WebSocket(host + "/ws?gameId=" + gameId);
		}
		if (ws) {
			ws.onmessage = messageHandler;
			ws.onclose = function() {
				console.log("CLOSED CONNECTION");
			};
			ws.onopen = function() {
				console.log("OPENED CONNECTION");
			};
		}
	}, [messageHandler]);
	return ws;
}
