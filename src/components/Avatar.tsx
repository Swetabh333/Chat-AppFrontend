import React from "react";

type propsType = {
  online:boolean,
  username: string,
  userId: string,
};

const Avatar: React.FC<propsType> = ({ online, username, userId }) => {
  const bg_colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const color = bg_colors[userIdBase10 % bg_colors.length];
  return (
    <div
      className={
        "h-8 w-8 rounded-full text-black flex items-center justify-center opacity-70 relative border border-white " +
        color
      }
    >
      <div className="w-full text-center opacity-70">
        {username ? username.slice(0, 1) : ""}
      </div>
      {online && (
        <div className="absolute w-3 h-3 bg-green bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-500 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
};

export default Avatar;
