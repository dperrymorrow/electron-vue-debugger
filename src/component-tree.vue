<template>
  <li :class="{ active, opened, children: component.$children.length }">
    <a
      class="component-link"
      @click.prevent="toggle"
    >
      &lt;{{ kebabCase(component.$options.name) || component.$options._componentTag }}&gt;
      <span
        v-if="component.$children.length"
        class="count"
      >{{ component.$children.length }}</span>

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
    <ul v-if="component.$children.length && opened">
      <component-tree
        v-for="comp in component.$children.filter(comp => comp.$options._componentTag !== 'debugger')"
        :component="comp"
        :key="comp._uid"
      />
    </ul>

  </li>
</template>

<script>
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

  mounted() {
    this.$root.$on("navClick", activeKey => {
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
        this.$root.$emit("navClick", this.component._uid);
        this.$root.$emit("dataSource", { component: this.component });
      }
    }
  }
};
</script>
