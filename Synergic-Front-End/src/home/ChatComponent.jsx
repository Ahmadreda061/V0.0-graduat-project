import React, { useState, useEffect } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import "./ChatComponent.css";

const ChatComponent = () => {
  const [username, setUsername] = useState(localStorage.getItem("fname"));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("e99edca4c943d312b3e9", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup subscription on component unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    console.log("Sending message:", message);

    axios
      .post("https://localhost:8000/api/messages", {
        username,
        message,
      })
      .then((response) => {
        console.log("Message sent successfully", response);
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div>
      <app-navbar></app-navbar>
      <div
        className="row"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="container parent"
          style={{
            margin: "auto",
            minWidth: "400px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
            <div
              className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom"
              style={{
                backgroundColor: "#f5f5f5",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              {/* <input
                className="fs-5 fw-semibold"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              /> */}
            </div>
            <div
              className="list-group list-group-flush border-bottom scrollarea"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="list-group-item list-group-item-action py-3 lh-tight"
                >
                  <div className="d-flex w-100 align-items-center justify-content-between">
                    <strong className="mb-1">{msg.username}</strong>
                  </div>
                  <div className="col-10 mb-1 small">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={submit} style={{ padding: "10px" }}>
            <div style={{ display: "flex" }}>
              <input
                className="form-control"
                placeholder="Write a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn">Send</button>
            </div>
          </form>
        </div>
      </div>
      <br />
      <br />
      <app-footer></app-footer>
    </div>
  );
};

export default ChatComponent;
