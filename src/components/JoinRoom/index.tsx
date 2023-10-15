import { useEffect } from "react";
import { useAtom } from "jotai";
import { atomUN, atomID } from "../../jotai";
import { socket } from "../../socket";
import "./index.css";

function JoinRoom() {
    const [atomUsername, setAtomUsername] = useAtom(atomUN);
    const [atomRoomID, setAtomRoomID] = useAtom(atomID);

    useEffect(() => {
        if (atomUsername !== "" && atomRoomID !== "") {
            const username = atomUsername;
            const room = atomRoomID;
            console.log(username, room);

            socket.connect();
            socket.emit("joinRoom", { username, room });
        }
    }, [atomUsername, atomRoomID]);

    useEffect(() => {
        socket.on("Error", (data) => {
            alert(data.message);
        });

        return () => {
            socket.off("Error");
        };
    }, [socket]);

    function ioJoinRoom(e: any) {
        e.preventDefault();
        setAtomUsername(e.target.username.value);
        setAtomRoomID(e.target.roomID.value);
    }

    return (
        <div>
            <form className="joinRoom" onSubmit={(e) => ioJoinRoom(e)}>
                <h2>Join room!</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    id="username"
                />
                <input
                    type="text"
                    name="roomID"
                    placeholder="roomId"
                    id="roomID"
                />
                <button type="submit">Join!!!</button>
            </form>
        </div>
    );
}

export default JoinRoom;
