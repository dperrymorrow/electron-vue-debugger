import Debugger from "./Debugger.vue";
if (typeof window !== "undefined" && window.Vue) Vue.component("debugger", Debugger);
export default Debugger;
