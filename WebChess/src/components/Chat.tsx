import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

function Chat() {
  const [connection, setConnection] = useState(null);
  const [pairedUser, setPairedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5247/gameHub")
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => console.log("Connected to SignalR hub"))
      .catch((err) => console.error("Error connecting to hub:", err));

    newConnection.on("Paired", (user) => {
      setPairedUser(user);
      console.log("Paired with user:", user);
    });

    newConnection.on("ReceiveMessage", (senderId, message) => {
      setMessages((prevMessages) => [...prevMessages, { senderId, message }]);
      console.log("Received message:", message);
    });

    newConnection.on("PairedUserDisconnected", () => {
      setPairedUser(null);
      console.log("Paired user disconnected");
    });

    return () => {
      newConnection.stop().then(() => console.log("Connection stopped"));
    };
  }, []);

  const sendMessage = async () => {
    if (connection && pairedUser) {
      await connection.send("SendMessage", pairedUser, message);
      setMessages((prevMessages) => [...prevMessages, { senderId: "Me", message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      {pairedUser ? (
        <>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <b>{msg.senderId}:</b> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </>
      ) : (
        <div>Waiting for a pair...</div>
      )}
    </div>
  );
}

export default Chat;
