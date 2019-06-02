/* istanbul ignore file */
const chalk = require("chalk");

const stringifyHeaders = headers =>
  JSON.stringify(
    headers,
    [
      "date",
      "Host",
      "Referer",
      "User-Agent",
      "cookie",
      "set-cookie",
      "expires",
      "location",
      "x-csrftoken"
    ],
    2
  );
const response = r => {
  console.log(
    chalk.blue("==== req headers ====>\n"),
    stringifyHeaders(r.request.gotOptions.headers),
    chalk.blue("\n==== req headers ====>")
  );
  console.log(
    chalk.blueBright(r.requestUrl),
    chalk.bold("\n==== status ====\n"),
    r.statusCode,
    chalk.bold("\n==== status ====")
  );
  console.log(
    chalk.yellow("<==== res headers ====\n"),
    stringifyHeaders(r.headers),
    chalk.yellow("\n<==== res headers ====")
  );
};
const error = e =>
  console.log(
    chalk.red("==== error ====\n"),
    e,
    chalk.red("\n==== error ====")
  );
const log = l =>
  console.log(chalk.bold("==== log ====\n"), l, chalk.bold("\n==== log ===="));
const Log = {
  response,
  error,
  log
};
module.exports = Log;
