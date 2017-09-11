<template lang="pug">
  #app
    h1
      | {{ $store.state }}
    debugger(:components="$children")
</template>


<script>
import Debugger from "../src";

export default {
  components: {
    Debugger,
  },
};
</script>
