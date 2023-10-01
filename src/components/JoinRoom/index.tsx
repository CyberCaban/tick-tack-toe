import { useState } from "react";
import { socket } from "../../socket";
import "./index.css";

function JoinRoom() {
    function ioJoinRoom(e: any) {
        e.preventDefault();
        console.log(e.target.username.value);
        const username = e.target.username.value;
        const room = e.target.roomID.value;

        socket.connect();
        socket.emit("joinRoom", { username, room });
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
