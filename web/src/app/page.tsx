"use client";
import { useEffect, useState, useRef } from "react";
import { msg } from "./types/msgs";
import { io, Socket } from "socket.io-client";
import * as dotenv from "dotenv";

const Home: () => JSX.Element = (): JSX.Element => {
  const [msgs, setMsgs] = useState<msg[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  dotenv.config();
  useEffect(() => {
    socketRef.current = io(
      `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`
    );

    socketRef.current.on("message", (newMsg: msg) => {
      setMsgs((prevMsgs) => [...prevMsgs, newMsg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const msg: msg = { message: newMessage };
      socketRef.current?.emit("new_message", msg);
      setNewMessage("");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col w-3/4 h-3/4 bg-slate-600 overflow-auto">
        <div className="flex flex-col gap-2 mx-5 mt-2">
          {msgs.map((msg, index) => (
            <div key={index} className="bg-white p-2 rounded">
              {msg.message}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 self-center self">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="p-2 rounded"
            placeholder="Escribe tu mensaje"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
