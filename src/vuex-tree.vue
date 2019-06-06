<template>
  <li>
    <ul>

      <li
        v-if="usingVuex"
        :class="{ active: activeKey == 'vuex' }"
      >
        <a @click.prevent="dataChange({ name: 'vuex', id: 'vuex', data: $store.state })">Vuex</a>
      </li>
      <li
        v-if="usingVuex"
        :class="{ active: activeKey == 'getters' }"
      >
        <a @click.prevent="dataChange({ name: 'getters', id: 'getters', data: $store.getters })">Vuex Getters</a>
      </li>
      <li
        v-if="usingVuex"
        :class="{ active: activeKey == 'mutations' }"
      >
        <a @click.prevent="dataChange({ name: 'mutations', id: 'mutations', data: mutations })">
          Vuex Mutations
          <span
            v-if="Object.keys(mutations).length"
            class="count reload"
            @click="clearMutations"
          >Clear</span>
        </a>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: "VuexTree"
};
</script>

<style lang="css" scoped>
</style>
