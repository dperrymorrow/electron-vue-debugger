<template>
  <div class="example-component">
    {{ label }}
  </div>
</template>


<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    }
  },
  methods: {}
};
</script>


<style lang="stylus">
  .example-component
    width: 300px
    background-color: tomato
    height: 300px
</style>
