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

    return () => {
      socket.off("devInfo");
    };
  }, [socket]);

  const test = async (e: any) => {
    socket.emit("devInfo");
    // customFetch("play/connect", "POST", { password: "password" }, "").then(
    //     (res) => {
    //         console.log(res);
    //     }
    // );
  };

  return (
    <div className="App">
      <JoinRoom />
      <Chat />
      {showPickASide ? `Pick a side: ` : `Your side: ${atomSide} `}
      {showPickASide ? <PickASide /> : null}
      <SquareField />
    </div>
  );
}
