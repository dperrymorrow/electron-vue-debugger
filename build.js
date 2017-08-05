"use strict";

const fs = require("fs");
const stylus = require("stylus");
const styles = fs.readFileSync(__dirname + "/styles/debugger.styl", "utf-8");

stylus.render(styles, { filename: "debugger.styl", compress: true }, (err, css) => {
  if (err) throw err;
  const payload = '{"css": "' + css + '"}';

  fs.writeFile(__dirname + "/styles/debugger.css.json", payload, (err, data) => {
    if (err) {
      return console.log(err);
    }
  });
});
