import Onitama from "../../components/onitama/App"

export default function SingleplayerGame() {
  return (
    <div>
			<Onitama
				skipWaitingRoom={true}
				wsSettings={{
					gameKind:"singleplayer",
				}}
			/>
    </div>
  );
}
