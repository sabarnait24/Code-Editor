import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import logo from "../icons8-play-67.png";
import SocketClient from "./SocketClient";
import { useParams } from "react-router-dom";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");


// const socket=io("https://code-editor-api-l6iv.onrender.com");
function Compiler() {
  
const params=useParams();
console.log(params);
  const [data, setData] = useState("");
 const [outputValue, setOutputValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const roomID = params.Id;
  const username=params.username;

  console.log(roomID);

  const onSubmit = async () => {
    var e = document.getElementById("langselect");
    var lang = e.value;
    const odata = {
      code: data,
      lang: lang,
      input: inputValue,
    };
    console.log(odata);
    await fetch("http://localhost:5000/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(odata),
    })
      .then((result) => {
        console.log(result);
        return result.json();
      })
      .then((getdata) => {
        handleOutputChange(getdata.output);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  socket.on("codechangeListen",(data) =>{
    setData(data);

  })

  const handleCodeChange = (value) => {
    console.log("hehe",value);
    setData(value);
    socket.emit('codeChange', {
      roomID,
      value
    });
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    socket.emit("inputChange", {
      roomID,
      newValue
    });
  };
  const handleOutputChange = (output) => {
    setOutputValue(output);
    socket.emit('outputChange', {
      roomID,
      output
    });
  };

  

  socket.on("inputChangeListen", (data) => {
    if(roomID!==data.roomID){
      return;
    }
    setInputValue(data.newValue);
  });

  socket.on('outputChangeListen', (data) => {
    if(roomID!==data.roomID){
      return;
    }
  
    setOutputValue(data.output);
  });

  socket.on("codeChangeListen",(data)=>{
    console.log(data);
    if(roomID!==data.roomID){
      return;
    }
    setData(data.value);
  })

  return (
    <div className="grid grid-cols-10 divide-x ">
      <div className="col-span-2 bg-slate-50">
        <SocketClient  roomID={roomID}  username={username}  data={data} socket={socket}></SocketClient>
      </div>
      <div className=" min-h-screen bg-slate-50 col-span-7">
        <h2
          className="flex justify-center my-2 text-black font-black
        "
        >
          ONLINE IDE
        </h2>
        <div className="grid grid-cols-2">
          <select
            className="select select-bordered w-3/4 max-w-xs bg-slate-200 text-black my-2  border border-black justify-end"
            style={{ width: "250px" }}
            id="langselect"
          >
            <option value="c" className="text-black">
              C
            </option>
            <option value="cpp17" className="text-black">
              Cpp
            </option>
            <option value="java" className="text-black">
              Java
            </option>
            <option value="python3" className="text-black">
              Python
            </option>
          </select>
          <div className="flex justify-end">
            <button
              className="btn btn-outline btn-success my-2"
              style={{ width: "120px", height: "5px" }}
              onClick={onSubmit}
            >
              Run
              <img
                src={logo}
                alt=""
                style={{ width: "20px" }}
                className="mx-1"
              ></img>{" "}
            </button>
          </div>
        </div>

        <div>
          <CodeMirror
            className="text-lg font-bold"
            value={data}
            height="70vh"
            theme="dark"
            extensions={[javascript({ jsx: true })]}
            onChange={handleCodeChange}
          />
        </div>

        <div className="grid grid-cols-2 items-end ">
          <div className="pr-2 my-1">
            <p className="text-black my-1 flex justify-center font-extrabold">
              INPUT FILE
            </p>
            <textarea
              className="textarea textarea-bordered bg-black w-full h-56 text-white text-lg font-extrabold"
               value={inputValue} onChange={handleInputChange}
            />
          </div>
          <div className="pl-2 my-1">
            <p className="text-black my-1 flex justify-center font-extrabold">
              OUTPUT FILE
            </p>
            <textarea
              className="textarea textarea-bordered bg-black w-full h-56 text-white text-lg font-extrabold"
              value={outputValue}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="col-span-1 bg-slate-50"></div>
    </div>
  );
}

export default Compiler;
