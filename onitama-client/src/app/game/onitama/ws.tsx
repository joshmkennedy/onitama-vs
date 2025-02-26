"use client"
import { useEffect } from "react";

const gameId = typeof window != "undefined" && new URLSearchParams(window.location.search).get("gameId");
let ws: WebSocket;
export function useWS(messageHandler: (msg: any) => void) {
	useEffect(() => {
		if (!gameId) {
			console.log("No game Id Found will be given a new one");
		}
		if (!ws) {
			ws = new WebSocket("ws://192.168.68.112:8080/ws?gameId=" + gameId);
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
