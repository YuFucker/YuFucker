const WebSocket = require('ws');
const open = require('open');
const got = require('got');
const Log = require('./logger');
const bell = require('./bell');
const { preWork, login, onLesson } = require('./config');

(() => new Promise((resolve, reject) => {
  const ws = new WebSocket('wss://www.yuketang.cn/wsapp/');
  ws.onclose = (e) => {
    Log.error(e);
  };
  ws.onopen = () => {
    Log.log('connection opening...');
    got(...preWork.genForm())
      .then((resp) => {
        Log.response(resp);
      })
      .catch(err => Log.error(err));
    (function getQRCode() {
      ws.send('{"op":"requestlogin","role":"web","version":1.4,"type":"qrcode"}');
      if (ws.readyState === 1) {
        setTimeout(getQRCode, 30 * 1000);
      }
      // ws.readyState === 1 && setTimeout(getQRCode, 1000 * 30);
    }());
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // console.log(data);
    if (data.op === 'requestlogin') {
      open(data.ticket);
    }
    if (data.op === 'loginsuccess') {
      ws.close();
      Log.log('WebSocket Closed');
      resolve({
        Auth: data.Auth,
        UserID: data.UserID,
      });
    }
  };
  ws.onerror = (error) => {
    reject(error);
  };
}))()
  .then((data) => {
    bell();
    return got.post(...login.genForm(data));
  })
  .then((resp) => {
    Log.response(resp);
    return got(...onLesson.genForm(null));
  })
  .then((resp) => {
    Log.response(resp);
    if (!resp.body.success) {
      throw Error('getting onLessons info wrong');
    }
    // eslint-disable-next-line camelcase
    const { on_lesson } = resp.body.data;
    // eslint-disable-next-line camelcase
    if (!(on_lesson && on_lesson.length > 0)) {
      throw Error('getting onLessons info wrong');
    }
    // eslint-disable-next-line camelcase
    if (on_lesson && on_lesson.length > 0) {
      bell();
    }
  })
  .catch(e => console.log(e));
