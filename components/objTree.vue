
<template>
  <div class="vue-debugger obj-tree" :class="{ open: isOpen, empty: length == 0 }" >

    <span class="key"
      v-if="name != undefined" :class="type" @click.prevent="toggle">
      {{ name }}<span class="key-val-divider">: </span>
    </span>

    <span class="type"
      v-if="hasChildren" @click.prevent="toggle" :class="type">
      {{ type }} {{ length }}
    </span>

    <span v-if="hasChildren && isOpen" class="type json" @click.prevent="log">toJSON</span>

    <span class="container" v-if="hasChildren && isOpen">
      <obj-tree
        v-for="val, key in truncateTree(value)"
        :key="key"
        :name="key.toString()" :parentOpen="type =='Array'" :value="val">
      </obj-tree>
    </span>

    <span class="value" :class="type" v-else-if="!hasChildren">
      {{ printValue() }}
    </span>
  </div>
</template>

<script>
import Type from "type-of-is";

export default {
  name: "obj-tree",
  props: ["name", "value", "parentOpen"],

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
