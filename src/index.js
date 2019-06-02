const WebSocket = require("ws");
const open = require("open");
const Log = require("./logger");
const got = require("got");
const { preWork, login } = require("./config");
(() => {
  return new Promise((resolve, reject) => {
    ws = new WebSocket("wss://www.yuketang.cn/wsapp/");
    ws.onclose = e => {};
    ws.onopen = e => {
      console.log("Connection open...");
      got(...preWork.genForm())
        .then(resp => {
          Log.response(resp);
        })
        .catch(err => Log.error(err));
      (function getQRCode() {
        ws.send(
          '{"op":"requestlogin","role":"web","version":1.4,"type":"qrcode"}'
        );
        ws.readyState === 1 && setTimeout(getQRCode, 1000 * 30);
      })();
    };
    ws.onmessage = event => {
      let data = JSON.parse(event.data);
      // console.log(data);
      if (data.op === "requestlogin") {
        open(data.ticket);
      }
      if (data.op === "loginsuccess") {
        ws.close();
        console.log("WebSocket closed");
        resolve({
          Auth: data.Auth,
          UserID: data.UserID
        });
      }
    };
    ws.onerror = error => {
      reject(error);
    };
  });
})()
  .then(data => {
    console.log(data, typeof data);
    return got.post(...login.genForm(data));
  })
  .then(resp => {
    resp.requestUrl.Log.response(resp);
  })
  .catch(e => console.log(e));
