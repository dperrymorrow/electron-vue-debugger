<template>

  <ul class="vuex-tree">
    <li :class="{ active: activeKey === 'vuex:state' }">
      <a @click.prevent="selectState">Vuex State</a>
    </li>
    <li :class="{ active: activeKey === 'vuex:getters' }">
      <a @click.prevent="selectGetters">Vuex Getters</a>
    </li>
    <li :class="{ active: activeKey === 'vuex:mutations' }">
      <a @click.prevent="selectMutations">
        Vuex Mutations
        <span
          v-if="Object.keys(mutations).length"
          class="count reload"
          @click="clearMutations"
        >Clear</span>
      </a>
    </li>
  </ul>

</template>

<script>
export default {
  name: "VuexTree",

  data() {
    return {
      mutations: {},
      activeKey: null
    };
  },

  mounted() {
    this.$root.$on("navClick", activeKey => {
      this.activeKey = activeKey;
    });

    this.$store.subscribe((mutation, state) => {
      this.$set(
        this.mutations,
        `${mutation.type} | ${this.timeNow()}`,
        mutation.payload
      );
    });
  },

  methods: {
    clearMutations() {
      this.mutations = {};
    },

    selectGetters() {
      this.$root.$emit("navClick", "vuex:getters");
      this.$root.$emit("dataSource", {
        name: "getters",
        id: "getters",
        data: this.$store.getters
      });
    },

    selectMutations() {
      this.$root.$emit("navClick", "vuex:mutations");
      this.$root.$emit("dataSource", {
        name: "mutations",
        id: "mutations",
        data: this.mutations
      });
    },

    selectState() {
      this.$root.$emit("navClick", "vuex:state");
      this.$root.$emit("dataSource", {
        name: "vuex",
        id: "vuex",
        data: this.$store.state
      });
    },

    timeNow() {
      const d = new Date();
      return [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        (d.getMilliseconds() / 10).toFixed(2)
      ].join(":");
    }
  }
};
</script>


<style lang="stylus">
@require "./vars.styl"

.vuex-tree
  margin-bottom: $debug-padding

</style>
