import React from "react";

const Contact: React.FC = () => {
  return (
    <div>
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
        {selectedUserId === e && <div className="bg-Purple w-2"></div>}
        <div className="p-4 flex gap-3 items-center">
          <Avatar online={true} username={onlinePeople[e]} userId={e} />
          <div>{onlinePeople[e]}</div>{" "}
          {/* Kept this div to show messages as well in chat-name page */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
