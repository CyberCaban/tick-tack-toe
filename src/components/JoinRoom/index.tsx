import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { setRoomID, setUsername } from "../../store/infoSlice";
import "./index.css";

function JoinRoom() {
	const info = useSelector((state: any) => state.info.info);
	const dispatch = useDispatch();

	const Username = (username: string) => {
		dispatch(setUsername({ username }));
	};
	const RoomID = (roomID: string) => {
		dispatch(setRoomID({ roomID }));
	};

	useEffect(() => {
		if (info.username !== "" && info.roomID !== "") {
			console.log(info);
			const username = info.username;
			const room = info.roomID;

			socket.connect();
			socket.emit("joinRoom", { username, room });
		}
	}, [info.username, info.roomID]);

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
		Username(e.target.username.value);
		RoomID(e.target.roomID.value);
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
