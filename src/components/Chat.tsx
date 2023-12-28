import React, { useEffect, useState, FormEvent, useRef,MutableRefObject } from "react";
import "../assets/styles/chat.css";
import { RootState } from "../state/store";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { uniqBy } from "lodash";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

const Chat: React.FC = () => {
  type online = {
    [key: string]: string;
  };
  interface messagesInt {
    text: string,
    isOur: boolean,
    _id:string | number,
    sender:string,
    recipient:string,
    createdAt:string,
    updatedAt:string
  }

  interface messagesInt2{
    text:string,
    isOur:boolean,
    _id:string | number
  }

  type onlineArray = {
    userId: string;
    username: string;
  };

  type messageType ={
    recipient:string,
    sender:string
  }

  type offlineUser = {
    _id:string,
    username:string
  }


  const { user } = useSelector((state: RootState) => state.auth);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<online>({});
  const [offlinePeople, setOfflinePeople] = useState<online>({});
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<(messagesInt | messagesInt2)[]>([]);
  const messageRef:MutableRefObject<HTMLDivElement | null> = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    connectToWs();
  }, []);

  //To reconnect to the socket in case it closes.

  const handleLogOut = async () => {
    await axiosInstance.post("/auth/logout");
    ws?.close();
    navigate("/");
  };

  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    ws.addEventListener("message", handleOnline);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  };
  useEffect(() => {
    const div = messageRef.current as HTMLDivElement;
    div?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axiosInstance.get(`/api/messages/${selectedUserId}`).then((res) => {
        const { data } = res;
        setMessages(() => [
          ...data.map((message:messageType) => ({
            ...message,
            isOur: selectedUserId === message.recipient ? true : false,
          })),
        ]);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axiosInstance.get("/getOffline").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p:offlineUser) => p.username !== user)
        .filter((p:offlineUser) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePpl:{[key:string]:string} = {};
      if (offlinePeopleArr) {
        offlinePeopleArr.forEach((elem:offlineUser) => {
          offlinePpl[elem._id] = elem.username;
        });
        setOfflinePeople(offlinePpl);
      }
    });
  }, [onlinePeople]);

  const showOnline = (peopleArray: onlineArray[]) => {
    const people: { [key: string]: string } = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  const handleOnline = (e: MessageEvent) => {
    const msgData = JSON.parse(e.data);

    if ("usersOnline" in msgData) {
      showOnline(msgData.usersOnline);
    } else {
      setMessages((prev: (messagesInt | messagesInt2)[]) => [
        ...prev,
        { ...msgData, isOur: false },
      ]);
    }
  };



  const sendMessage = (ev: FormEvent) => {
    ev.preventDefault();

    ws?.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
      }),
    );
    setNewMessage("");
    setMessages((prev: (messagesInt | messagesInt2)[]) => [
      ...prev,
      { text: newMessage, isOur: true, _id: Date.now() },
    ]);
  };
  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className="h-screen flex">
      <div className="bg-black w-1/4 border-r splitter flex-col">
        <div className="grow">
          <div className="chat-app text-Purple font-bold text-xl  border-b p-4 flex itmes-center gap-4">
            <i className="fa-brands fa-square-whatsapp fa-2x"></i>
            <span className="chatty mt-1">Chatty</span>
          </div>

          <div>
            {Object.keys(onlinePeople)
              .filter((e) => {
                return onlinePeople[e] !== user;
              })
              .map((e) => {
                if (onlinePeople[e]) {
                  return (
                    <div
                      onClick={() => {
                        setSelectedUserId(e);
                      }}
                      className={
                        "text-white cursor-pointer border-b chat-name flex gap-3" +
                        (selectedUserId === e ? " bg-smoothBlack" : "")
                      }
                      key={e}
                    >
                      {selectedUserId === e && (
                        <div className="bg-Purple w-2"></div>
                      )}
                      <div className="p-4 flex gap-3 items-center">
                        <Avatar
                          online={true}
                          username={onlinePeople[e]}
                          userId={e}
                        />
                        <div>{onlinePeople[e]}</div>{" "}
                        {/* Kept this div to show messages as well in chat-name page */}
                      </div>
                    </div>
                  );
                }
              })}
            {Object.keys(offlinePeople).map((e) => {
              return (
                <div
                  onClick={() => {
                    setSelectedUserId(e);
                  }}
                  className={
                    "text-white cursor-pointer border-b chat-name flex gap-3" +
                    (selectedUserId === e ? " bg-smoothBlack" : "")
                  }
                  key={e}
                >
                  {selectedUserId === e && (
                    <div className="bg-Purple w-2"></div>
                  )}
                  <div className="p-4 flex gap-3 items-center">
                    <Avatar
                      online={false}
                      username={offlinePeople[e]}
                      userId={e}
                    />
                    <div>{offlinePeople[e]}</div>{" "}
                    {/* Kept this div to show messages as well in chat-name page */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 p-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          {user}

          <button
            onClick={handleLogOut}
            className="bg-Purple rounded-md py-1 px-2 hover:opacity-80 block mt-2"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-darkBlack w-3/4 flex flex-col">
        <div className="chat-area flex-grow overflow-y-scroll">
          {/*  */}
          {!selectedUserId && (
            <div className="h-full flex justify-center items-center">
              <span className="text-gray-400">
                &#8592; Select a user to start chatting with them.
              </span>
            </div>
          )}
          {!!selectedUserId &&
            
            messagesWithoutDupes.map((e: messagesInt | messagesInt2) => {
              return (
                <div
                  key={e._id}
                  className={"p-3 " + (e.isOur ? "text-right" : "text-left")}
                >
                  <div
                    className={
                      "inline-block text-left text-white p-2 rounded-lg text-wrap " +
                      (e.isOur ? "bg-Purple" : "bg-smoothBlack")
                    }
                  >
                    {e.text}
                  </div>
                </div>
              );
            })}
          <div ref={messageRef}></div>
        </div>
        {!!selectedUserId && (
          <form
            onSubmit={sendMessage}
            className="msg-area p-4 bg-black w-full flex gap-3 items-center"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(ev) => setNewMessage(ev.target.value)}
              placeholder="Type your message here ..."
              className="flex-grow h-3/4 p-4 text-white rounded-lg text-base"
            />
            <label className="text-white hover:opacity-60 hover:text-Purple cursor-pointer">
              {/* <input onChange={sendFile} type="file" className="hidden" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-Purple bton flex items-center justify-center text-white hover:opacity-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
