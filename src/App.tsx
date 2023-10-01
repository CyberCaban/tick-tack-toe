import { useEffect, useState } from "react";
import "./App.css";
import customFetch from "./handlers/customFetch";
import { socket } from "./socket";
import JoinRoom from "./components/JoinRoom";

export default function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        console.log(isConnected);
    }, [isConnected]);

    const test = async (e: any) => {
        customFetch("play/connect", "POST", { password: "password" }, "").then(
            (res) => {
                console.log(res);
            }
        );
    };

    return (
        <div className="App">
            <JoinRoom />
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
