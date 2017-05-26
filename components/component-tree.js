"use strict";

const Type = require("type-of-is");
const { remote } = require("electron");

module.exports = {
  name: "component-tree",
  template: `
    <li :class="{ active: isActive, opened: open, children: hasChildren }">
      <a class="component-link" @click.prevent="select">
        <{{ component.$options.name || component.$options._componentTag}}>
        <span class="count" v-if="hasChildren">
          {{ children.length }}
        </span>

        <div class="toolbar" v-if="open || isActive">
          <span class="btn" @click.stop.prevent="triggerData"><strong>Reload</strong></span>
          <span class="btn" @click.stop.prevent="inspect">Inspect</span>
          <span class="btn" @click.stop.prevent="sendToConsole">$vm</span>
        </div>
      </a>


      <ul v-if="hasChildren && open">
        <component-tree
           v-for="comp in children" v-on:dataChange="dataChange" :activeKey="activeKey" :component="comp" :key="comp._uid">
        </component-tree>
      </ul>


    </li>
  `,

  data() {
    return {
      open: false,
      int: 0,
      children: this.component.$children,
    };
  },

  mounted() {
    this.int = setInterval(() => {
      this.$forceUpdate();
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.int);
  },

  props: ["component", "activeKey"],

  computed: {
    hasChildren() {
      return this.children.length > 0;
    },
    isActive() {
      return this.component._uid == this.activeKey;
    },
    componentData() {
      return this.component.$data || {};
    },
    componentProps() {
      return this.component.$options.propsData || {};
    },
    componentComputed() {
      const computed = {};

      for (let key in this.component) {
        if (
          key.indexOf("$") !== 0 &&
          key.indexOf("_") !== 0 &&
          Type.string(this.component[key]) !== "Function" &&
          !Object.keys(this.componentData).includes(key) &&
          !Object.keys(this.componentProps).includes(key)
        ) {
          computed[key] = this.component[key];
        }
      }

      return computed;
    },
  },

  methods: {
    sendToConsole() {
      window.$vm = this.component;
      console.groupCollapsed(`window.$vm = ${this.component.$options.name}`);
      console.log(this.component);
      console.groupEnd();
    },
    inspect() {
      const coords = this.component.$el.getBoundingClientRect();
      remote.getCurrentWebContents().inspectElement(parseInt(coords.left), parseInt(coords.top));
    },
    dataChange(args) {
      this.$emit("dataChange", args);
    },
    select() {
      this.triggerData();
      this.toggle();
    },
    triggerData() {
      const data = {
        data: this.componentData,
        props: this.componentProps,
        computed: this.componentComputed,
      };

      if (this.component.$v) {
        data.$v = this.component.$v;
      }

      this.dataChange({
        element: this.component.$el,
        name: this.component.$options.name,
        id: this.component._uid,
        data,
      });
    },
    refresh() {
      this.triggerData();
      this.open = true;
    },
    toggle() {
      this.open = !this.open;
    },
  },
};
