import Vue from "vue";
import Vuex from "Vuex";
import ElectronVueDebugger from "../src";

Vue.use(Vuex);
Vue.use(ElectronVueDebugger);

const store = new Vuex.Store({
  state: { foo: "bar" },
  mutations: {
    setFoo(state, val) {
      state.foo = val;
    }
  }
});

import App from "./app.vue";

new Vue({
  store,
  el: "#app",
  render: h => h(App)
});
