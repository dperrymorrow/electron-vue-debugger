<template>
  <div id="app">
    <h1>{{ $store.state }}</h1>
    <debugger :components="$children"/>
    <example-component label="foobar"/>
    <button @click="mutate">Mutate Vuex</button>
  </div>
</template>


<script>
import Debugger from "../src";
import ExampleComponent from "./example-component.vue";

export default {
  components: {
    Debugger,
    ExampleComponent
  },
  methods: {
    mutate() {
      this.$store.commit("setFoo", "poo bear");
    }
  }
};
</script>
