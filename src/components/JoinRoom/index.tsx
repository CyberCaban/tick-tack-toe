import { useEffect, useState } from "react";
import { socket } from "../../socket";
import "./index.css";

function JoinRoom() {
	const [username, setUsername] = useState("");
	const [room, setRoom] = useState("");

	useEffect(() => {
		socket.emit("joinRoom", { username, room });
	}, [username, room]);

	function ioJoinRoom(e: any) {
		e.preventDefault();
		console.log(e.target.username.value);
		setUsername(e.target.username.value);
		setRoom(e.target.roomID.value);
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
