import Debugger from "./Debugger.vue";
import ObjTree from "./ObjTree.vue";

if (typeof window !== "undefined" && window.Vue) {
  Vue.component("debugger", Debugger);
  Vue.component("obj-tree", ObjTree);
}
