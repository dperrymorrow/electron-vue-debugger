
<template>
  <div
    :class="{ open: isOpen, empty: length == 0 }"
    class="vue-debugger obj-tree"
  >
    <span
      v-if="name !== undefined"
      :class="type"
      class="key"
      @click.prevent="toggle"
    >
      {{ name }}
      <span class="key-val-divider">:&nbsp;</span>
    </span>

    <span
      v-if="hasChildren"
      :class="type"
      class="type"
      @click.prevent="toggle"
    >
      {{ type }} {{ length }}
    </span>
    <span
      v-if="hasChildren && isOpen"
      class="type json"
      @click.prevent="log"
    >toJSON</span>

    <span
      v-if="hasChildren && isOpen"
      class="container"
    >
      <obj-tree
        v-for="(val, key) in truncateTree(value)"
        :key="key"
        :name="key.toString()"
        :parent-open="type =='Array'"
        :value="val"
      />
    </span>
    <span
      v-else-if="!hasChildren"
      :class="type"
      class="value"
    >{{ printValue() }}</span>
  </div>
</template>

<script>
import Type from "type-of-is";

export default {
  name: "ObjTree",
  props: {
    name: { type: String, required: true },
    value: {
      validator: () => true,
      required: false,
      default: () => null
    },
    parentOpen: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      int: 0,
      maxLength: 50,
      beenClicked: false,
      open: this.name ? false : true
    };
  },

  computed: {
    isOpen() {
      if (!this.beenClicked && this.parentOpen) return true;
      return this.open;
    },

    length() {
      if (this.type === "Object") return Object.keys(this.value).length;
      if (this.type === "Array") return this.value.length;
      return 0;
    },
    type() {
      return Type.string(this.value);
    },
    hasChildren() {
      return this.length > 0;
    }
  },

  methods: {
    truncateTree(val) {
      if (Type.string(val) === "Array" && this.length > this.maxLength) {
        const arr = val.slice(0, this.maxLength);
        arr.push(`... (${val.length - arr.length} more)`);
        return arr;
      }
      return val;
    },

    log() {
      console.dir(JSON.parse(JSON.stringify(this.value, null, 2)));
    },

    printValue() {
      if (this.type === "null") return "null";
      if (this.value === undefined) return "undefined";
      if (this.value === "" && this.type === "String") return '""';
      if (this.type === "Array" && this.value.length === 0) return "[]";
      if (this.type === "Object" && Object.keys(this.value).length === 0)
        return "{}";

      return this.value.toString();
    },

    toggle() {
      this.beenClicked = true;
      this.open = !this.open;
    }
  }
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
