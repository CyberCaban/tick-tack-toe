import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useAtom } from "jotai";
import { atomSD } from "./jotai";
import customFetch from "./handlers/customFetch";
import JoinRoom from "./components/JoinRoom";
import Chat from "./components/ChatComponent";
import PickASide from "./components/PickASide";
import "./App.css";

export default function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [atomSide, setAtomSide] = useAtom(atomSD);

    useEffect(() => {
        console.log("User is connected:", isConnected);
    }, [isConnected]);

    useEffect(() => {
        socket.on("devInfo", (data) => {
            console.log(data);
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
            {atomSide == "" ? <PickASide /> : null}
            <div className="field">
                <div className="mainSquare">
                    <div className="cell-row">
                        <div
                            className="cell cell-0"
                            onClick={(e) => test(e)}
                        ></div>
                        <div className="cell cell-1"></div>
                        <div className="cell cell-2"></div>
                    </div>
                    <div className="cell-row">
                        <div className="cell cell-3"></div>
                        <div className="cell cell-4"></div>
                        <div className="cell cell-5"></div>
                    </div>
                    <div className="cell-row">
                        <div className="cell cell-6"></div>
                        <div className="cell cell-7"></div>
                        <div className="cell cell-8"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
