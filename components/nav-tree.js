"use strict";

module.exports = {
  name: "nav-tree",
  props: ["components", "activeKey"],

  template: `
    <div class="vue-debugger nav-pane">
      <ul>
        <li :class="{ active: activeKey == 'vuex' }">
          <a @click.prevent="dataChange({ name: 'vuex', id: 'vuex', data: $store.state })">
            Vuex
          </a>
        </li>

        <li :class="{ active: activeKey == 'mutations' }">
          <a @click.prevent="dataChange({ name: 'mutations', id: 'mutations', data: mutations })">
            Mutations
            <span v-if="Object.keys(mutations).length" class="count reload" @click='clearMutations'>Clear</span>
          </a>
        </li>

        <component-tree
          v-for="comp in components"
          :key="comp._uid"
          @dataChange="dataChange"
          v-if="comp.$options._componentTag !== 'debugger'"
          :component="comp"
          :activeKey="activeKey"
        >
        </component-tree>
      </ul>
    </div>
  `,

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

  computed: {},

  beforeDetroy() {
    clearInterval(this.int);
  },

  methods: {
    timeNow() {
      var d = new Date();
      return [d.getHours(), d.getMinutes(), d.getSeconds(), (d.getMilliseconds() / 10).toFixed(2)].join(":");
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
