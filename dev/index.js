import Vue from "vue";
import Vuex from "Vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: { foo: "bar" },
  mutations: {
    setFoo(state, val) {
      state.foo = val;
    },
  },
});

import App from "./App.vue";

new Vue({
  store,
  el: "#app",
  render: h => h(App),
});
