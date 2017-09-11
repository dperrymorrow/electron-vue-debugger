<template lang="pug">
  .example-component {{ label }}
</template>


<script>
export default {
  methods: {},
  props: {
    label: {
      type: String,
    },
  },
};
</script>


<style lang="stylus">

  .example-component
    width: 300px
    background-color: tomato
    height: 300px
</style>
