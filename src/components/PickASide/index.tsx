import React, { useEffect } from "react";
import { socket } from "../../socket";
import { useAtom } from "jotai";
import { atomID, atomSD, atomUN } from "../../jotai";

export default function PickASide() {
    const [atomUsername, setAtomUsername] = useAtom(atomUN);
    const [atomRoomID, setAtomRoomID] = useAtom(atomID);
    const [atomSide, setAtomSide] = useAtom(atomSD);

    useEffect(() => {}, [socket]);

    function pick(e: any) {
        const side = e.target.value;
        if (atomUsername !== "" && atomRoomID !== "") {
            socket.emit("pickASide", {
                side: side,
            });
            setAtomSide(side);
        }
        console.log(side);
    }

    return (
        <div className="PickASide">
            <button value="X" onClick={(e) => pick(e)}>
                X
            </button>
            <button value="O" onClick={(e) => pick(e)}>
                O
            </button>
        </div>
    );
}
