<template lang="pug">
  #app
    h1
      | {{ $store.state }}
    debugger(:components="$children")
    example-component(label="foobar")
    button(@click="mutate") Mutate Vuex
</template>


<script>
import Debugger from "../src";
import ExampleComponent from "./ExampleComponent.vue";

export default {
  components: {
    Debugger,
    ExampleComponent,
  },
  methods: {
    mutate() {
      this.$store.commit("setFoo", "poo bear");
    },
  },
};
</script>
