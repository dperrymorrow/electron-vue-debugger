import Debugger from "./Debugger.vue";
import ObjTree from "./ObjTree.vue";

export default {
  install(Vue) {
    Vue.component("debugger", Debugger);
    Vue.component("obj-tree", ObjTree);
  },
};
