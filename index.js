"use strict";

module.exports = {
  install(Vue) {
    Vue.component("component-tree", require("./components/component-tree"));
    Vue.component("nav-tree", require("./components/nav-tree"));
    Vue.component("obj-tree", require("./components/obj-tree"));
    Vue.component("debugger", require("./components/debugger"));

    const tag = document.createElement("style");
    tag.innerText = require("./styles/debugger.css.json").css;
    document.body.appendChild(tag);
  },
};
