<template lang="pug">
  #app
    h1 Why hello there vue app...
    debugger(:children="$children")
</template>


<script>
import Vue from "Vue";

export default {
  name: "app",
};
</script>
