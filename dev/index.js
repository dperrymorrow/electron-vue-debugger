import Vue from "Vue";
import Vuex from "Vuex";
import App from "./App.vue";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: { foo: "bar" },
  modules: {},
});

console.log(store);

new Vue({
  store,
  el: "#app",
  render: h => h(App),
});
