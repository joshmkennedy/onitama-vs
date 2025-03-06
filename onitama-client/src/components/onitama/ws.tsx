import { useEffect, useState } from "react";

let ws: WebSocket|undefined;

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
	const [socket, setSocket] = useState<WebSocket | undefined>();
	const gameId =
		typeof window != "undefined" &&
		new URLSearchParams(window.location.search).get("gameId");
	useEffect(() => {
		console.log("we running")
		if (!gameId) {
			console.log("No game Id Found will be given a new one");
		}
		if (!ws) {
			console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
			const host = process.env.NEXT_PUBLIC_BACKEND_URL;
			ws = new WebSocket(host + `/ws?gameId=${gameId}&kind=${info.gameKind}`);
			setSocket(ws);
		}
		if (ws) {
			console.log(ws);
			ws.onmessage = messageHandler;
			ws.onclose = function() {
				console.log("CLOSED CONNECTION");
				ws = undefined;
				setSocket(undefined);
			};
			ws.onopen = function() {
				console.log("OPENED CONNECTION");
			};
		}
		return () => {
			setTimeout(() => {
				if (ws && ws?.readyState === WebSocket.OPEN) {
					ws.close(1000, "Client closing connection");
					setSocket(undefined);
				}
			}, 100); // Small delay
		};
	}, [messageHandler, info.gameKind, setSocket]);

	return socket;
}
