import Debugger from "./debugger.vue";
import ObjTree from "./obj-tree.vue";

function install(Vue) {
  Vue.component("debugger", Debugger);
  Vue.component("obj-tree", ObjTree);
}

export default { install };
export { install };
