<template>
  <div class="vue-debugger nav-pane">
    <vuex-tree v-if="$store" />

    <ul v-if="$router">
      <li :class="{ active: activeKey === 'router' }">
        <a @click="selectRouter">Router</a>
      </li>
    </ul>

    <hr v-if="$router || $store">

    <ul>
      <component-tree
        v-for="comp in $root.$children"
        :key="comp._uid"
        :component="comp"
      />
    </ul>
  </div>
</template>

<script>
import VuexTree from "./vuex-tree";
import ComponentTree from "./component-tree.vue";

export default {
  components: {
    VuexTree,
    ComponentTree
  },

  data() {
    return { activeKey: null };
  },

  mounted() {
    this.$root.$on("navClick", activeKey => {
      this.activeKey = activeKey;
    });
  },

  methods: {
    selectRouter() {
      this.$root.$emit("navClick", "router");
      this.$root.$emit("dataSource", {
        name: "route",
        id: "router",
        data: this.$route
      });
    }
  }
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

  hr
    border-bottom: 1px solid $debug-purple
    border-top: 1px solid black
    opacity: 0.3
    margin: ($debug-padding/2) $debug-padding ($debug-padding/2) 0

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
