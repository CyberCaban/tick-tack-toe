import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { atomID, atomUN } from "../../jotai";
import { socket } from "../../socket";
import "./index.css";

type IMessage = {
    message: string;
    username: string;
    timestamp: number;
};

export default function Chat() {
    const [atomUsername, setAtomUsername] = useAtom(atomUN);
    const [atomRoomID, setAtomRoomID] = useAtom(atomID);

    const [messageReceived, setMessagesReceived] = useState<IMessage[]>([]);
    const [message, setMessage] = useState("");

    const messageDivRef = useRef(null);

    useEffect(() => {
        socket.on("messageReceive", (data: IMessage) => {
            console.log(data);
            setMessagesReceived((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    timestamp: data.timestamp,
                },
            ]);
        });

        return () => {
            socket.off("messageReceive");
        };
    }, [socket]);

    useEffect(() => {
        // @ts-ignore
        messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
    }, [messageReceived]);

    function sendMessage(e: any) {
        e.preventDefault();
        if (message !== "" && atomUsername !== "" && atomRoomID !== "") {
            const timestamp = Date.now();

            socket.emit("sendMessage", {
                username: atomUsername,
                room: atomRoomID,
                message,
                timestamp,
            });
            setMessage("");
        }
    }

    function TimeStampConvert(timestamp: number) {
        const data = new Date(timestamp);
        return data.toLocaleString();
    }

    return (
        <div className="chatComponent">
            <div className="messages" ref={messageDivRef}>
                {messageReceived.map((msg) => {
                    return (
                        <span>
                            <span>{TimeStampConvert(msg.timestamp)}</span>
                            <p>
                                {msg.username}: {msg.message}
                            </p>
                        </span>
                    );
                })}
            </div>
            <form
                action=""
                className="messagesInput"
                onSubmit={(e) => sendMessage(e)}
            >
                <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
