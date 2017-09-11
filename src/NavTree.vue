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
        Vue.set(this.mutations, mutation.type + " | " + this.timeNow(), mutation.payload);
      });
    }
  },

  beforeDetroy() {
    clearInterval(this.int);
  },

  computed: {
    usingVuex() {
      console.log(this.$store);
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
