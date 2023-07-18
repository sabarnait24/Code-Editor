import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import logo from "../icons8-play-67.png";
import SocketClient from "./SocketClient";
import { useLocation, useParams } from "react-router-dom";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");


// const socket=io("https://code-editor-api-l6iv.onrender.com");
function Compiler() {
  
const params=useParams();
// console.log("pa" ,params);
  const [data, setData] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  // const editorRef = useRef(null);
  const roomID = params["Id"];
  const username=params["username"];

  // console.log("room" ,roomID);
  // console.log("user" , username);

  const onSubmit = async () => {
    var e = document.getElementById("langselect");
    var lang = e.value;

    // console.log(input);
    const odata = {
      code: data,
      lang: lang,
      input: input,
    };

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
        console.log(getdata["output"]);
        setOutput(getdata["output"]);
        // socket.emit("outputchange", {
        //   roomID,
        //   outputvalue: getdata["output"],
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // socket.on("codesync", ( {value} ) => {
  //   console.log("hi", value);
  //   setData(value);
  // });
  useEffect(() => {
    // socket.on("codesync", ( {value} ) => {
    //   console.log("hi", value);
    //   setData(value);
    // });
    // socket.on("inputsync", ({ inputvalue }) => {
    //   console.log(inputvalue);
    //   setInput(inputvalue);
    // });
    // socket.on("outputsync", ({ outputvalue }) => {
    //   console.log("output is", outputvalue);
    //   setOutput(outputvalue);
    // });
  }, []);

  // const location = useLocation();
  // console.log(location);
 
  // const username = location.state["username"];

  return (
    <div className="grid grid-cols-10 divide-x ">
      <div className="col-span-2 bg-slate-50">
        <SocketClient  roomID={roomID}  username={username}  data={data}></SocketClient>
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
            onChange={(value) => {
              setData(value);
              socket.emit("codechange", {
                roomID,
                value,
              });
            }}
          />
        </div>

        <div className="grid grid-cols-2 items-end ">
          <div className="pr-2 my-1">
            <p className="text-black my-1 flex justify-center font-extrabold">
              INPUT FILE
            </p>
            <textarea
              className="textarea textarea-bordered bg-black w-full h-56 text-white text-lg font-extrabold"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                socket.emit("inputchange", {
                  roomID,
                  inputvalue: e.target.value,
                });
              }}
            />
          </div>
          <div className="pl-2 my-1">
            <p className="text-black my-1 flex justify-center font-extrabold">
              OUTPUT FILE
            </p>
            <textarea
              className="textarea textarea-bordered bg-black w-full h-56 text-white text-lg font-extrabold"
              value={output}
              onChange={(e) => {
                setOutput(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="col-span-1 bg-slate-50"></div>
    </div>
  );
}

export default Compiler;
