import { useRef, useEffect } from "react";
import style from "./debug.module.css";
import { atom, useAtom } from "jotai";
import { gameStateStore } from "../state";

type dbgType = Record<string, boolean>;
export const debugState = atom<dbgType>({
  gridHints: false,
  unitHints: false,
  logState: false,
});

export default function Debug() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [debugVal, set] = useAtom(debugState);
  function close() {
    dialogRef.current?.close();
  }

  function toggle(key: string) {
    set((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const [gameState] = useAtom(gameStateStore);
  useEffect(() => {
    if (gameState && debugVal.logState) {
      console.log(gameState);
    }
  }, [gameState, debugVal.logState]);

  return (
    <>
      <button
        className={style.dbgbutton}
        onClick={() => dialogRef.current?.showModal()}
      >
        Debug
      </button>
      <dialog ref={dialogRef} className={style.dbgdialog}>
        <header
          className="dialog-header"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "1em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>Debug</p>
          <button onClick={close}>Close</button>
        </header>
        <div className={style.actionlist}>
          <button onClick={() => toggle("gridHints")}>Toggle Grid Hints</button>
          <button onClick={() => toggle("unitHints")}>Show Unit Hints</button>
          <button onClick={() => toggle("logState")}>Log State</button>
        </div>
      </dialog>
    </>
  );
}
