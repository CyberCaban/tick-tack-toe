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

  const test = async (e: any) => {
    socket.emit("devInfo");
  };

  return (
    <div className="flex justify-center px-3 py-2 rounded-md bg-zinc-500/50 m-2">
      <form className="flex flex-col justify-center w-80" onSubmit={(e) => ioJoinRoom(e)}>
        <h2 onClick={(e) => test(e)}>Join room!</h2>
        <input
          className="text-input"
          type="text"
          name="username"
          placeholder="username"
          id="username"
        />
        <input type="text" name="roomID" placeholder="roomId" id="roomID" className="text-input "/>
        <button type="submit" className="btn-input hover:bg-zinc-500/50 after:shadow-lg before:shadow-none">Join!!!</button>
      </form>
    </div>
  );
}

export default JoinRoom;
