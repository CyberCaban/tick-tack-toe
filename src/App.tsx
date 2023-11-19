import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { socket } from "./socket";
import { atomSD, atomShowPickASide } from "./jotai";
import JoinRoom from "./components/JoinRoom";
import Chat from "./components/ChatComponent";
import PickASide from "./components/PickASide";
import SquareField from "./components/SquareField";
import "./App.css";

export default function App() {
  const [showPickASide, setShowPickASide] = useAtom(atomShowPickASide);
  const [atomSide, setAtomSide] = useAtom(atomSD);
  const [titleMessage, setTitleMessage] = useState("");

  useEffect(() => {
    // socket.emit("startGame");
  }, [atomSide]);

  useEffect(() => {
    socket.on("devInfo", (data) => {
      console.log(data);
    });

    socket.on("showPickASideComponent", () => {
      setShowPickASide((prev) => !prev);
    });

    socket.on("sidePick", (data) => {
      setAtomSide(data.side);
    });

    socket.on("gameRestart", () => {
      setTitleMessage("Game will restart in 5 seconds");
      setTimeout(() => {
        setTitleMessage("");
      }, 5000);
    });

    return () => {
      socket.off("devInfo");
    };
  }, [socket]);

  return (
    <div className="App">
      <JoinRoom />
      <Chat />
      {showPickASide ? (
        <>
          <p>Pick a side: </p>
          <PickASide />
        </>
      ) : (
        <p>Your side: {atomSide}</p>
      )}
      {titleMessage}
      <SquareField />
    </div>
  );
}
