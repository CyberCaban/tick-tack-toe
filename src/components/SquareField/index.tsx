import React, { useEffect, useState } from "react";
import "./index.css";
import { socket } from "../../socket";

type Cell =
  | "cell-00"
  | "cell-01"
  | "cell-02"
  | "cell-10"
  | "cell-11"
  | "cell-12"
  | "cell-20"
  | "cell-21"
  | "cell-22";

export default function SquareField(): JSX.Element {
  const [turn, setTurn] = useState<string>("");
  const [field, setField] = useState<Record<Cell, null | "X" | "O">>({
    "cell-00": null,
    "cell-01": null,
    "cell-02": null,
    "cell-10": null,
    "cell-11": null,
    "cell-12": null,
    "cell-20": null,
    "cell-21": null,
    "cell-22": null,
  });

  const size: number[] = [0, 1, 2];

  function handleTurn() {
    if (turn === "Your turn") {
      setTurn("Opponent turn");
    } else {
      setTurn("Your turn");
    }
  }

  useEffect(() => {
    socket.on("yourTurn", (data) => {
      console.log(data);

      setTurn(data.turn);
    });

    socket.on("fieldUpdate", (data) => {
      console.log(data);
      setField(data);
    });
  }, [socket]);

  function makeTurn(e: React.MouseEvent<HTMLDivElement>) {
    // @ts-ignore
    const cell = e.target.dataset;
    socket.emit("turn", cell);
  }

  return (
    <div className="field">
      <h2 onClick={() => handleTurn()}>{turn}</h2>
      <div className="mainSquare">
        {size.map((row) => (
          <div className="cell-row">
            {size.map((cell) => {
              const cellId: Cell = `cell-${row}${cell}` as Cell;

              return (
                <div
                  data-row={row}
                  data-cell={cell}
                  className={`cell cell-${row}-${cell}`}
                  onClick={(e) => makeTurn(e)}
                >
                  {field[cellId] === "X" ? <div className="cross"></div> : null}
                  {field[cellId] === "O" ? (
                    <div className="circle"></div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
