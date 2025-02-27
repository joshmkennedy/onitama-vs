import { useState } from "react";

export function CopyText({ value }: { value: string }) {
  const [btnText, setBtnText] = useState("Copy");
  function copy() {
    navigator.clipboard
      .writeText(value)
      .then(() => setBtnText("Copied!"))
      .catch(() => setBtnText("Oops Try again!"))
      .finally(() => {
        setTimeout(() => setBtnText("Copy"), 2000);
      });
  }
  return (
    <div className="copy-text">
      <input type="text" readOnly={true} value={value} />
      <button className="btn copy-button" onClick={copy}>
        {btnText}
      </button>
    </div>
  );
}
