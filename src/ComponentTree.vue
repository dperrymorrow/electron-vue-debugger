<template lang="pug">
  li(:class="{ active: isActive, opened: open, children: hasChildren }")
    a.component-link(@click.prevent="select")
      | &lt;{{ component.$options.name || component.$options._componentTag}}&gt;
      span.count(v-if="hasChildren") {{ children.length }}

      .toolbar(v-if="open || isActive")
        .btn(@click.stop.prevent="triggerData")
          strong Reload
        .btn(@click.stop.prevent="sendToConsole") $vm


    ul(v-if="hasChildren")
      component-tree(
        v-show="open",
        v-for="comp in children",
        @dataChange="dataChange",
        @set-open="setOpen",
        :activeKey="activeKey",
        :component="comp",
        :key="comp._uid"
      )

</template>

<script>
import Type from "type-of-is";

export default {
  name: "ComponentTree",
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
  },

  watch: {
    isActive(val) {
      if (val) {
        this.setOpen(true);
      }
    },
  },

  methods: {
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
        component: this.component,
      });
    },
    toggle() {
      this.open = !this.open;
    },
  },
};
</script>
