<template>
  <li :class="{ active: isActive, opened: open, children: hasChildren }">
    <a
      class="component-link"
      @click.prevent="select"
    >
      &lt;{{ kebabCase(component.$options.name) || component.$options._componentTag }}&gt;
      <span
        v-if="hasChildren"
        class="count"
      >{{ children.length }}</span>
      <div
        v-if="open || isActive"
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
    <ul v-if="hasChildren">
      <component-tree
        v-for="comp in children"
        v-show="open"
        :active-key="activeKey"
        :component="comp"
        :key="comp._uid"
        @dataChange="dataChange"
        @set-open="setOpen"
      />
    </ul>
  </li>
</template>

<script>
import kebabCase from "lodash.kebabcase";

export default {
  name: "ComponentTree",

  filters: { kebabCase },
  props: {
    component: { type: Object, required: true },
    activeKey: { type: [String, Number], required: true }
  },

  data() {
    return {
      open: false,
      int: 0,
      children: this.component.$children
    };
  },

  computed: {
    hasChildren() {
      return this.children.length > 0;
    },
    isActive() {
      return this.component._uid === this.activeKey;
    }
  },

  watch: {
    isActive(val) {
      if (val) {
        this.setOpen(true);
      }
    }
  },

  mounted() {
    this.int = setInterval(() => {
      this.$forceUpdate();
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.int);
  },

  methods: {
    kebabCase(val) {
      return kebabCase(val);
    },

    setOpen(val) {
      if (this.open !== val) this.open = val;
      this.$emit("set-open", val);
    },
    sendToConsole() {
      window.$vm = this.component;
      console.groupCollapsed(`window.$vm = ${this.component.$options.name}`);
      console.log(this.component);
      console.groupEnd();
    },

    dataChange(args) {
      this.$emit("dataChange", args);
    },
    select() {
      this.triggerData();
      this.toggle();
    },
    triggerData() {
      this.dataChange({
        component: this.component
      });
    },
    toggle() {
      this.open = !this.open;
    }
  }
};
</script>
