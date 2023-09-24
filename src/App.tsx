import "./App.css";
import customFetch from "./handlers/customFetch";
import io from "socket.io-client";

const socket = io("http://localhost:3000/");
socket.on("connect", () => {
    console.log("123");
});

export default function App() {
    const connect = async () => {
        socket.emit("message", (data: any) => {
            console.log(data);
        });
    };
    const test = async (e: any) => {
        customFetch("play/connect", "POST", { password: "password" }, "").then(
            (res) => {
                console.log(res);
            }
        );
    };

    return (
        <div className="App">
            <div className="field">
                <button onClick={() => connect()}>connect</button>
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
