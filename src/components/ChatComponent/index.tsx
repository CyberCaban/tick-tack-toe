import { useEffect, useState } from "react";
import { socket } from "../../socket";
import "./index.css";

type IMessage = {
    message: string;
    username: string;
    timestamp: number;
};

export default function Chat() {
    const [messageReceived, setMessagesReceived] = useState<IMessage[]>([
        {
            message: "Welcome banana",
            username: "server",
            timestamp: 1696784420752,
        },
    ]);

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

    function sendMessage(e: any) {
        e.preventDefault();
        // socket.
    }

    function TimeStampConvert(timestamp: number) {
        const data = new Date(timestamp);
        return data.toLocaleString();
    }

    return (
        <div className="chatComponent">
            <div className="messages">
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
                    placeholder="Сообщение"
                />
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}
