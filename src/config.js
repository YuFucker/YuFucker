const cookieJar = require("./cookie");
const { API } = require("./api");
const Log = require("./logger");

const baseUrl = "https://www.yuketang.cn";

const headers = {
  accept: "text/plain",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  // "content-type": "application/x-www-form-urlencoded",
  "x-requested-with": "XMLHttpRequest",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
  "content-type": "application/x-www-form-urlencoded",
  authority: "www.yuketang.cn",
  accept: "text/plain",
  origin: "https://www.yuketang.cn",
  referer: "https://www.yuketang.cn/web"
};

class Config {
  constructor(url, options) {
    this.url = url;
    this.options = options;
  }

  *[Symbol.iterator]() {
    yield this.url;
    yield this.options;
  }
}

class Worker {
  constructor(url) {
    this.url = url;
  }
  genForm() {
    return new Config(this.url, {
      baseUrl,
      cookieJar,
      headers
    });
  }
}
class WorkerWithToken extends Worker {
  genForm(data) {
    cookieJar.getCookies(baseUrl, (err, cookies) => {
      this.token = cookies.filter(
        cookie => cookie.key === "csrftoken"
      )[0].value;
      err && Log.error(err);
    });
    return new Config(this.url, {
      baseUrl,
      cookieJar,
      headers: {
        ...headers,
        "x-csrftoken": this.token
      },
      body: data,
      json: true
    });
  }
}
module.exports = {
  preWork: new (class extends Worker {})(API.user_profile),
  login: new WorkerWithToken(API.pc_web_login)
};
