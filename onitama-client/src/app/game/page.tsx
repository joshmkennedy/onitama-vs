import Onitama from "../../components/onitama/App"

export default function Game() {
  return (
    <div>
			<Onitama wsSettings={{
				gameKind:"mulitplayer",
			}}/>
    </div>
  );
}
