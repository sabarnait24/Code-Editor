// import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import { io } from "socket.io-client";
import AvatarUser from "./AvatarUser";

// const socket = io("http://localhost:5000");

function SocketClient(props) {
  const socket = props.socket;
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(props.roomID);
      toast.success("Room ID Copied");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }
  const [client, setClient] = useState([]);
  // const [recentUser, setRecentUser] = useState("");
  const navigate = useNavigate();
  function leaveRoom() {
    localStorage.clear();

    navigate("/");
    window.location.reload();
  }

  const roomID = props.roomID;
  const username = props.username;
  socket.on("get-joined-members", ({ joinedusername, MembersDetails }) => {
    console.log(MembersDetails);
    console.log("joined username", joinedusername);

    MembersDetails.map((member) =>
      member.username !== joinedusername
        ? toast.success(`${joinedusername} joined`, {
            toastId: "success1",
          })
        : null
    );

    setClient(MembersDetails);
  });

  socket.on("joined-members-list", (data) => {
    setClient(data);
  });

  socket.on("user-disconnected", (data) => {
    console.log("disconnect", data);
    if (data.roomID !== roomID) return;
    console.log("name", data.username);
    toast.error(`${data.username} disconnected`, {
      toastId: "error1",
    });
  });

  useEffect(() => {
    socket.on("connection_error", (err) => handleErrors(err));
    socket.on("connection_failed", (err) => handleErrors(err));

    function handleErrors(e) {
      console.log("socket error", e);
      toast.error("Socket connection failed, try again later.");
      navigate("/");
    }
    // getUser();

    socket.emit("join", {
      roomID,
      username,
    });

    // const editorRef=props.editorRef;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <ToastContainer />
      </div>
      <div className="my-20">
        <h4 className="flex justify-center text-black font-black my-6">
          {" "}
          Connected Members
        </h4>
        {client?.map((element) => (
          <AvatarUser username={element.username} />
        ))}
      </div>
      <div className="flex justify-center items-center my-2">
        <button className="btn btn-outline btn-primary " onClick={copyRoomId}>
          Copy ROOM ID
        </button>
      </div>
      <div className="flex justify-center items-center my-2">
        <button className="btn btn-outline btn-error " onClick={leaveRoom}>
          Leave The Room
        </button>
      </div>
      s
    </div>
  );
}

export default SocketClient;
