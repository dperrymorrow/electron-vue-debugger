import Debugger from "./Debugger.vue";
import ObjTree from "./ObjTree.vue";

function install(Vue) {
  Vue.component("debugger", Debugger);
  Vue.component("obj-tree", ObjTree);
}

export default { install };
export { install };
