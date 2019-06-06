<template>
  <li :class="{ active, opened, children: children.length }">
    <a
      class="component-link"
      @click.prevent="toggle"
    >
      &lt;{{ kebabCase(component.$options.name) || component.$options._componentTag }}&gt;
      <span
        v-if="children.length"
        class="count"
      >{{ children.length }}</span>

      <div
        v-if="active"
        class="toolbar"
      >
        <div
          class="btn"
          @click.stop.prevent="triggerData"
        >
          <strong>Reload</strong>
        </div>
        <div
          class="btn"
          @click.stop.prevent="sendToConsole"
        >$vm</div>
      </div>
    </a>

    <!-- recursive -->
    <ul v-if="children.length && opened">
      <component-tree
        v-for="comp in children"
        :component="comp"
        :key="comp._uid"
      />
    </ul>

  </li>
</template>

<script>
import EventBus from "./event-bus";
import kebabCase from "lodash.kebabcase";

export default {
  name: "ComponentTree",

  props: {
    component: { type: Object, required: true }
  },

  data() {
    return {
      opened: false,
      active: false,
      int: 0
    };
  },

  computed: {
    children() {
      return this.component.$children;
    }
  },

  watch: {
    children() {
      console.log("changed");
    }
  },

  mounted() {
    EventBus.$on("navClick", activeKey => {
      this.active = activeKey === this.component._uid;
    });

    this.int = setInterval(() => {
      this.$forceUpdate();
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.int);
  },

  methods: {
    kebabCase: val => kebabCase(val),

    sendToConsole() {
      window.$vm = this.component;
      console.groupCollapsed(`window.$vm = ${this.component.$options.name}`);
      console.dir(this.component);
      console.groupEnd();
    },

    toggle() {
      if (this.opened && !this.active) this.active = true;
      else this.opened = !this.opened;
      if (this.opened) {
        EventBus.$emit("navClick", this.component._uid);
        EventBus.$emit("dataSource", { component: this.component });
      }
    }
  }
};
</script>
