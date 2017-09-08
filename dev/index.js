import Debugger from "../src/index.js";
Vue.use(Debugger);

import App from "./App.vue";
import Vue from "Vue";

new Vue({
  el: "#app",
  render: h => h(App),
});
