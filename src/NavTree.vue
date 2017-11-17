<template lang="pug">
  .vue-debugger.nav-pane
    ul
      li(v-if="usingVuex", :class="{ active: activeKey == 'vuex' }")
        a(@click.prevent="dataChange({ name: 'vuex', id: 'vuex', data: $store.state })") Vuex

      li(v-if="usingVuex", :class="{ active: activeKey == 'mutations' }")
        a(@click.prevent="dataChange({ name: 'mutations', id: 'mutations', data: mutations })") Mutations
          span.count.reload(v-if="Object.keys(mutations).length", @click="clearMutations") Clear

      component-tree(
        v-if="comp.$options._componentTag !== 'debugger'",
        v-for="comp in components",
        @dataChange="dataChange",
        :key="comp._uid",
        :component="comp",
        :activeKey="activeKey"
      )
</template>

<script>
import ComponentTree from "./ComponentTree.vue";

export default {
  props: ["components", "activeKey"],

  components: {
    ComponentTree,
  },

  mounted() {
    this.int = setInterval(() => {
      this.$forceUpdate();
    }, 1000);

    if (this.$store) {
      this.$store.subscribe((mutation, state) => {
        this.$set(this.mutations, mutation.type + " | " + this.timeNow(), mutation.payload);
      });
    }
  },

  beforeDetroy() {
    clearInterval(this.int);
  },

  computed: {
    usingVuex() {
      return typeof this.$store === "undefined" ? false : true;
    },
  },

  methods: {
    timeNow() {
      var d = new Date();
      return [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        (d.getMilliseconds() / 10).toFixed(2),
      ].join(":");
    },

    dataChange(args) {
      this.$emit("dataChange", args);
    },

    clearMutations() {
      this.mutations = {};
    },
  },

  data() {
    return {
      mutations: {},
      int: 0,
    };
  },
};
</script>

<style lang="stylus">
@require('./vars')

.vue-debugger.nav-pane
  box-sizing: border-box
  width: $debug-nav-width
  display: inline-block
  float: left
  height: 100%
  overflow: auto
  padding: $debug-padding
  padding-right: 0
  background-color: rgba($debug-dark, 0.95)
  border-right: 1px solid darken($debug-dark, 10%)

  ul, li
    list-style: none
    padding: 0

  ul
    padding: 0
    padding-left: $debug-padding

  > ul
    margin: 0
    padding: 0

  li
    padding: .3em
    padding-right: 0
    color: $debug-purple
    position: relative


    &.children:before
      position: absolute
      left: -12px
      content: '▸'

    &.children.opened:before
      content: '▾'

    a
      color: inherit
      display: block
      font-weight: bold

      &:hover
        .toolbar
          opacity: 1
          display: flex

    &.active
      color: $debug-yellow
</style>
