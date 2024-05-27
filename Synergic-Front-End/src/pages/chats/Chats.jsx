import React, { useContext, useEffect, useRef, useState } from "react";
import "../../style/chats/chats.css";
import getImageUrl from "../../utils/image-util";
import Contact from "./Contact";
import MyMsg from "./MyMsg";
import OtherMsg from "./OtherMsg";
import { userInfoContext } from "../../App";
import getRooms from "./utils/getRooms";
import getRoomUsers from "./utils/getRoomUsers";
import sendMsg from "./utils/sendMsg";
import getMsgs from "./utils/getMsgs";

function Chats() {
  const { userInfo } = useContext(userInfoContext);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomUsers, setRoomUsers] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const fileRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMessagesCountRef = useRef(0); // to handle scrolling when there is a new message

  useEffect(() => {
    if (rooms.length > 0 && !activeRoom) setActiveRoom(rooms[0]?.roomID); // the first time u open the chats declare the active room to the first room
  }, [rooms]);

  useEffect(() => {
    const fetchRoomsAndUsers = async () => {
      const rooms = await getRooms(userInfo.userToken);

      // Fetch messages for each room and set room users
      const roomData = await Promise.all(
        rooms.map(async (room) => {
          const users = await getRoomUsers(room.roomID);
          const msgs = await getMsgs(userInfo.userToken, room.roomID);

          const lastMsg = msgs
            .reverse()
            .find((msg) => msg.senderName !== userInfo.username);

          return {
            ...room,
            users,
            lastMsg,
            messages: msgs.reverse(), // Store messages for each room
          };
        })
      );

      setRooms(roomData); // in the room there is all messages, users, lastMsg and the data come from getRooms

      roomData.forEach((room) => {
        // get the users alone from room and set it in setRoomUsers
        const users = room.users;
        setRoomUsers((prevUsers) => ({
          ...prevUsers,
          [room.roomID]: [
            ...users,
            users[1].username === userInfo.username ? 0 : 1, // the index of other user
          ],
        }));
      });
    };

    fetchRoomsAndUsers();

    const interval = setInterval(fetchRoomsAndUsers, 300);

    return () => clearInterval(interval);
  }, [userInfo.userToken]);

  useEffect(() => {
    if (activeRoom) {
      const activeRoomData = rooms.find((room) => room.roomID === activeRoom);
      if (activeRoomData) {
        setMessages(activeRoomData.messages);
      }
    }
  }, [activeRoom, rooms]);

  useEffect(() => {
    if (messages.length > prevMessagesCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages]);

  const contactElements = rooms.map((room, index) => {
    const users = roomUsers[room.roomID];

    if (!users) return null;
    const userIndex = users[2]; // get the index of other user
    return (
      <Contact
        key={index}
        name={users[userIndex]?.username} // username of other user
        img={users[userIndex]?.userPP} // profile pic of other user
        roomID={room.roomID}
        setActiveRoom={setActiveRoom} // Updated to handle active contact
        lastMsg={room.lastMsg}
        isActive={activeRoom === room.roomID}
      />
    );
  });

  const msgElements = messages.map((message, index) => {
    if (message.senderName === userInfo.username) {
      return (
        <MyMsg
          key={index}
          img={userInfo.profilePicture}
          name={message.senderName}
          time={message.sendTime}
          msg={message.message}
        />
      );
    } else {
      return (
        <OtherMsg
          key={index}
          img={
            roomUsers[activeRoom][roomUsers[activeRoom][2]].userPP // roomUsers[activeRoom] = array users and in index 2 in users there is the index of other user
          }
          name={message.senderName}
          time={message.sendTime}
          msg={message.message}
        />
      );
    }
  });

  const handleUploadAttachment = () => {
    fileRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (msg && activeRoom) {
      sendMsg(userInfo.userToken, activeRoom, msg).then((res) => {
        if (res) setMsg(""); // if send successfully make the field empty
      });
    }
  };

  return (
    <main className="chats">
      <div className="container">
        <div className="chats--messenger">
          <aside className="chats--sidebar">
            <header className="sidebar--header align-center">
              <img
                src={`data:image/png;base64,${userInfo.profilePicture}`}
                alt="my profile image"
                className="sidebar--header-img circle"
              />
              <p className="sidebar--header-username username">
                {userInfo.username}
              </p>
            </header>
            <div className="sidebar--contacts">{contactElements}</div>
          </aside>

          <div className="chats--messages">
            {rooms.length == 0 ? (
              <div className="no-msg">
                <img
                  src={getImageUrl("logo.png")}
                  alt=""
                  style={{ width: "200px" }}
                />
                <p>you don't have any messages yet.</p>
              </div>
            ) : (
              <>
                <header className="messages--header align-center">
                  {roomUsers[activeRoom] && (
                    <img
                      src={
                        roomUsers[activeRoom] &&
                        `data:image/png;base64,${
                          roomUsers[activeRoom][roomUsers[activeRoom][2]].userPP // roomUsers[activeRoom] = array users and in index 2 in users there is the index of other user
                        }`
                      }
                      alt="current chat other profile image"
                      className="messages--header-img circle"
                    />
                  )}

                  <p className="messages--header-username username">
                    {roomUsers[activeRoom] &&
                      roomUsers[activeRoom][roomUsers[activeRoom][2]].username}
                  </p>
                </header>
                <section className="messages--body">
                  <ul>
                    {msgElements}
                    <div ref={messagesEndRef} />
                  </ul>
                </section>
                <form
                  className="messsages--form align-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    className="messsages--form--write"
                    placeholder="Write your message... "
                    name=""
                    id=""
                    value={selectedFile ? selectedFile.name : msg}
                    onChange={(e) => setMsg(e.target.value)}
                    disabled={!!selectedFile} // Disable input if file is selected
                  />
                  <i
                    className="fa fa-paperclip attachment"
                    onClick={handleUploadAttachment}
                  >
                    <input
                      type="file"
                      ref={fileRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </i>
                  <button type="submit" className="submit">
                    <img
                      src={getImageUrl("noun-paper-plane-120421.svg")}
                      alt="submit"
                    />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Chats;
