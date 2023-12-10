import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { atomID, atomUN } from "../../jotai";
import { socket } from "../../socket";

type IMessage = {
  message: string;
  username: string;
  timestamp: number;
};

export default function Chat() {
  const [atomUsername, setAtomUsername] = useAtom(atomUN);
  const [atomRoomID, setAtomRoomID] = useAtom(atomID);

  const [messageReceived, setMessagesReceived] = useState<IMessage[]>([ {
    message: "sadafggbgcdf",
    username: "amoongus",
    timestamp: 1687898918753,
  }, {
    message: "dssssddf",
    username: "amoongus",
    timestamp: 1687898916111,
  }, {
    message: "okxvpokpoeskcs a,,zpxkodmvpse[qw[qwkfjdcv",
    username: "amoongus",
    timestamp: 1687898911111,
  }]);
  const [message, setMessage] = useState("");

  const messageDivRef = useRef(null);
  const inputMessageDivRef = useRef(null);

  useEffect(() => {
    socket.on("messageReceive", (data: IMessage) => {
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
      // @ts-ignore
      inputMessageDivRef.current.focus()
    }
  }

  function TimeStampConvert(timestamp: number) {
    const data = new Date(timestamp);
    return data.toLocaleString();
  }

  return (
    <div className="flex flex-col w-80 bg-zinc-500/50 justify-center px-3 py-2 rounded-md">
      <div className="messages flex flex-col overflow-y-scroll overflow-x-hidden pl-5 max-w-md max-h-48" ref={messageDivRef}>
        {messageReceived.map((msg) => {
          return (
            <span className="bg-zinc-500 px-0.5 py-0.5 rounded-md m-0.5">
              <span>{TimeStampConvert(msg.timestamp)}</span>
              <p>
                <span className="text-neutral-200/50">{msg.username}:</span> <span>{msg.message}</span>
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
          ref={inputMessageDivRef}
          className="text-input"
        />
        <button type="submit" className="btn-input">Send</button>
      </form>
    </div>
  );
}
