import React, { useEffect, useState } from "react";
import "./index.css";
import { socket } from "../../socket";

export default function SquareField(): JSX.Element {
  const [turn, setTurn] = useState<string>();

  const size: number[] = [0, 1, 2];

  useEffect(() => {
    socket.on("yourTurn", () => {
      setTurn("Your turn");
    });

    socket.on("fieldUpdate", (data) => {
      console.log(data);
    });
  }, [socket]);

  function makeTurn(e: React.MouseEvent<HTMLDivElement>) {
    // @ts-ignore
    const cell = e.target.dataset;
    socket.emit("turn", cell);
  }

  return (
    <div className="field">
      {turn}
      <div className="mainSquare">
        {size.map((row) => (
          <div className="cell-row">
            {size.map((cell) => (
              <div
                data-row={row}
                data-cell={cell}
                className={`cell cell-${row}-${cell}`}
                onClick={(e) => makeTurn(e)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
