"use client";

import { useEffect } from "react";
import socket from "../../socket/socket-client";

export default function Socks() {
  useEffect(() => {
    socket.on("message", (data) => {
      console.log("Received:", data);
    });

    socket.emit("message", "Hello from frontend!");

    return () => {
      socket.disconnect();
    };
  }, []);

  return <h1>Socket.IO Communication Established</h1>;
}
