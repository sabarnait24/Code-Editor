const express = require("express");
const router = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
var request = require("request");
var jsonParser = bodyParser.json();


router.post("/compile", (req, res) => {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;
  // console.log(code,input,lang);
  
  var result="";
  try {
    var program = {
      script: code,
      language: lang,
      stdin: input,
      versionIndex: "0",
      clientId: "b72f395320d93809d7a9fdb2aceaa547",
      clientSecret:"560fa6567307d002d35e84f65f9ba859d37a24274d337cc4206b3fdd83568eae",
      // clientId: process.env.CLIENT_Id,
      // clientSecret: process.env.CLIENT_SECRET,
      
    };
    request(
      {
        url: "https://api.jdoodle.com/v1/execute",
        method: "POST",
        json: program,
      },
      function (error, response, body) {
        result = body;
        if (error) {
          console.log(error);
        }
        if(result===""){
          res.send("error");
        }
        // console.log("res",result);
        res.json(result);
      }
    );
    
  } catch (error) {
    console.log("error is" , error);
  }

});

// router.post("/logout", (req, res) => {
//   res.clearCookie("auth_cookie");
//   res.status(200).json({ success: true });
// });
// router.post("/checkloggedin", authenticate, (req, res) => {
//   res.json({ success: true, user: req.user });
// });

module.exports = router;
