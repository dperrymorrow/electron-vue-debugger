<template>
  <div class="vue-debugger nav-pane">
    <ul>
      <li
        v-if="usingVuex"
        :class="{ active: activeKey == 'vuex' }"
      >
        <a @click.prevent="dataChange({ name: 'vuex', id: 'vuex', data: $store.state })">Vuex</a>
      </li>
      <li
        v-if="usingVuex"
        :class="{ active: activeKey == 'mutations' }"
      >
        <a @click.prevent="dataChange({ name: 'mutations', id: 'mutations', data: mutations })">
          Mutations
          <span
            v-if="Object.keys(mutations).length"
            class="count reload"
            @click="clearMutations"
          >Clear</span>
        </a>
      </li>
      <component-tree
        v-for="comp in components"
        v-if="comp.$options._componentTag !== 'debugger'"
        :key="comp._uid"
        :component="comp"
        :active-key="activeKey"
        @dataChange="dataChange"
      />
    </ul>
  </div>
</template>

<script>
import ComponentTree from "./ComponentTree.vue";

export default {
  components: {
    ComponentTree
  },
  props: {
    components: { type: Array, required: true },
    activeKey: { type: [String, Number], required: true }
  },

  data() {
    return {
      mutations: {},
      int: 0
    };
  },

  computed: {
    usingVuex() {
      return typeof this.$store === "undefined" ? false : true;
    }
  },

  mounted() {
    this.int = setInterval(() => {
      this.$forceUpdate();
    }, 1000);

    if (this.$store) {
      this.$store.subscribe((mutation, state) => {
        this.$set(
          this.mutations,
          `${mutation.type} | ${this.timeNow()}`,
          mutation.payload
        );
      });
    }
  },

  beforeDetroy() {
    clearInterval(this.int);
  },

  methods: {
    timeNow() {
      const d = new Date();
      return [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        (d.getMilliseconds() / 10).toFixed(2)
      ].join(":");
    },

    dataChange(args) {
      this.$emit("dataChange", args);
    },

    clearMutations() {
      this.mutations = {};
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
