import React from "react";
import Avatar from "react-avatar";

const AvatarUser = ({ username }) => {
  return (
    
      <div className="item flex justify-center  bg-gray-50 py-3 rounded-r">
        <Avatar name={username} size={50} round="14px" className="mx-3"/>
        <span className="w-full text-black flex items-center mx-3 font-semibold">{username ?? ""}</span>
        
      </div>
    
  );
};

export default AvatarUser;
