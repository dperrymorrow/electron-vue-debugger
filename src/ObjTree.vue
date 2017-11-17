
<template lang="pug">
  .vue-debugger.obj-tree(:class="{ open: isOpen, empty: length == 0 }")

    span.key(v-if="name != undefined" :class="type" @click.prevent="toggle")
      | {{ name }}
      span.key-val-divider :&nbsp;

    span.type(v-if="hasChildren" @click.prevent="toggle" :class="type") {{ type }} {{ length }}

    span.type.json(v-if="hasChildren && isOpen" @click.prevent="log") toJSON

    span.container(v-if="hasChildren && isOpen")
      obj-tree(
        v-for="val, key in truncateTree(value)"
        :key="key"
        :name="key.toString()"
        :parentOpen="type =='Array'"
        :value="val"
      )

    span.value(:class="type" v-else-if="!hasChildren") {{ printValue() }}
</template>

<script>
import Type from "type-of-is";

export default {
  props: ["name", "value", "parentOpen"],
  name: "ObjTree",
  data() {
    return {
      int: 0,
      maxLength: 50,
      beenClicked: false,
      open: this.name ? false : true,
    };
  },

  computed: {
    isOpen() {
      if (!this.beenClicked && this.parentOpen) this.open = true;
      return this.open;
    },

    length() {
      if (this.type == "Object") return Object.keys(this.value).length;
      if (this.type == "Array") return this.value.length;
      return 0;
    },
    type() {
      return Type.string(this.value);
    },
    hasChildren() {
      return this.length > 0;
    },
  },

  methods: {
    truncateTree(val) {
      if (Type.string(val) == "Array" && this.length > this.maxLength) {
        const arr = val.slice(0, this.maxLength);
        arr.push(`... (${val.length - arr.length} more)`);
        return arr;
      }
      return val;
    },

    log() {
      console.log(JSON.stringify(this.value, null, 2));
    },

    printValue() {
      if (this.type == "null") return "null";
      if (this.value == undefined) return "undefined";
      if (this.value == "" && this.type == "String") return '""';
      if (this.type == "Array" && this.value.length == 0) return "[]";
      if (this.type == "Object" && Object.keys(this.value).length == 0) return "{}";

      return this.value.toString();
    },

    toggle() {
      this.beenClicked = true;
      this.open = !this.open;
    },
  },
};
</script>


<style lang="stylus">

@require('./vars')

.vue-debugger .obj-tree
  display: block
  padding-left: $debug-padding

  .key
    cursor: pointer
    color: $debug-blue
    font-weight: bold
    position: relative

    .key-val-divider
      color: $debug-white

    &.Array, &.Object
      &:before
        position: absolute
        left: -12px
        content: '▸'

  &.empty .key
    cursor: auto

    &:before
      display: none

  .value
    color: $debug-green
    word-break: break-all

    &.null, &.undefined
      color: $debug-orange

    &.Number
      color: $debug-yellow

    &.Boolean
      color: $debug-yellow

    &.Array, &.Object
      color: $debug-white

  .container
    display: none

  &:not(.empty) > .key:hover
    color: lighten($debug-blue, 60%)

</style>
