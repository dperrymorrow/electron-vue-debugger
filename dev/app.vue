<template>
  <div id="app">
    <h1>{{ $store.state }}</h1>
    <debugger/>
    <example-component label="foobar"/>
    <button @click="mutate">Mutate Vuex</button>
  </div>
</template>


<script>
import ExampleComponent from "./example-component.vue";

export default {
  components: {
    ExampleComponent
  },
  methods: {
    mutate() {
      this.$store.commit("setFoo", "poo bear");
    }
  }
};
</script>
