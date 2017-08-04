
<template>
  <div class="vue-debugger-container" @click.prevent.stop>
    <transition name="debugger-highlight">
      <div
        class="vue-debugger highlighter"
        :style="highlighter"
        v-if="showHighlight"
        @click.stop.prevent="selectTargeted"
      >
        <h4>{{ targeted.$options._componentTag }}</h4>
      </div>
    </transition>

    <div class="vue-debugger pane" :class="{ opened: open }">
      <div class="drag-handle" @mousedown.stop.prevent="dragging = true"></div>
      <div class="vue-debugger target" :class="{ active: targeting }" @click.prevent="toggleTargeting">◎</div>
      <div class="vue-debugger toggle" @dblclick="clearStore" @click.prevent="toggle">🔮</div>

      <nav-tree
        :components="components"
        @dataChange="dataChange"
        :activeKey="activeKey"
        v-if="keepAlive || open">
      </nav-tree>

      <div class="vue-debugger main-pane" v-if="keepAlive || open">
        <obj-tree
          v-for="value, key in dataSource" :name="key" :value="value" :key="key">
        </obj-tree>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";

import navTree from "./components/navTree.vue";
import objTree from "./components/objTree.vue";
import componentTree from "./components/componentTree.vue";

export default {
  name: "debugger",

  mounted() {
    window.addEventListener("keydown", this.shortcuts);
    window.addEventListener("mouseup", this.disableDrag);
    window.addEventListener("mousemove", this.drag);
    window.addEventListener("resize", this.updateHeight);
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.shortcuts);
    window.removeEventListener("mouseup", this.disableDrag);
    window.removeEventListener("mousemove", this.drag);
    window.removeEventListener("resize", this.updateHeight);
  },

  methods: {
    shortcuts(ev) {
      if (ev.ctrlKey && ev.code == "KeyD") this.toggle();
    },
    disableDrag() {
      this.dragging = false;
    },
    showKey(key) {
      this.activeKey = key;
    },
    toggle() {
      this.open = !this.open;
      this.$el.querySelector(".vue-debugger.pane").removeAttribute("style");

      let storedY = localStorage.getItem("debugger-y");
      const pane = this.$el.querySelector(".vue-debugger.pane");

      if (storedY > document.body.offsetHeight) {
        storedY = null;
        localStorage.setItem("debugger-y", null);
      }

      if (this.open) {
        if (storedY && storedY !== "null") {
          pane.style.top = storedY + "px";
        } else {
          pane.style.top = "50%";
        }

        this.updateHeight();
      }
    },
    clearStore() {
      localStorage.setItem("debugger-y", null);
    },
    drag(event) {
      const pane = this.$el.querySelector(".vue-debugger.pane");
      if (this.dragging) {
        let top = event.pageY;
        top = top > window.innerHeight ? window.innerHeight : top;
        pane.style.top = top + "px";
        localStorage.setItem("debugger-y", top);
        this.updateHeight();
      }
    },
    updateHeight() {
      const pane = this.$el.querySelector(".vue-debugger.pane");
      pane.style.height = window.innerHeight - parseInt(pane.style.top) + "px";
    },
    dataChange(args) {
      const { component, data, id } = args;
      if (this.targeting) this.toggleTargeting();
      if (component) {
        this.selectComponent(component);
      } else {
        this.dataSource = data;
        this.activeKey = id;
      }

      this.setHighlightTimer();
    },
    selectComponent(component) {
      this.activeKey = component._uid;
      this.dataSource = {
        data: component.$data,
        props: component.$options.propsData || {},
        computed: this.getComputed(component),
      };
      this.activeEl = component.$el;
      this.showHighlight = this.activeEl != undefined;
      this.targeted = component;
    },
    setHighlightTimer() {
      if (this.highlightTimer) clearTimeout(this.highlightTimer);

      if (this.showHighlight) {
        this.highlightTimer = setTimeout(() => {
          this.showHighlight = false;
          this.highlightTimer = null;
        }, 1500);
      }
    },
    getComputed(component) {
      const computed = {};

      for (let key in component.$options.computed) {
        computed[key] = component[key];
      }

      return computed;
    },
    toggleTargeting() {
      this.targeting = !this.targeting;
      this.showHighlight = false;
      if (this.targeting) {
        document.documentElement.addEventListener("mousemove", this.handleMouseMove);
        document.documentElement.addEventListener("mousemove", this.handleMouseStop);
        document.documentElement.addEventListener("keydown", this.checkForEscape);
      } else {
        document.documentElement.removeEventListener("mousemove", this.handleMouseMove);
        document.documentElement.removeEventListener("mousemove", this.handleMouseStop);
        document.documentElement.removeEventListener("keydown", this.checkForEscape);
      }
    },
    selectTargeted() {
      if (this.targeting) this.toggleTargeting();
      if (!this.open) this.toggle();
    },
    handleMouseMove: throttle(function(ev) {
      this.mouseMoving = true;
      const component = this.findComponent(ev.target, this.components);
      if (component) {
        this.selectComponent(component);
      }
    }, 20),
    handleMouseStop: debounce(function(ev) {
      this.mouseMoving = false;
    }, 35),
    checkForEscape(ev) {
      if (ev.keyCode === 27 && this.targeting) {
        this.toggleTargeting();
      }
    },
    findComponent($el, components) {
      for (var i = 0; i < components.length; i++) {
        const component = components[i];
        if (component.$options._componentTag === "debugger") continue;
        if (component.$el === $el) return component;
        if (component.$el.contains($el)) {
          const foundComponent = this.findComponent($el, component.$children);
          if (foundComponent) return foundComponent;
          return component;
        }
      }
      if (!$el.parentElement) return;
      return this.findComponent($el.parentElement, components);
    },
  },

  props: {
    components: {
      type: Array,
      required: true,
    },
    keepAlive: {
      type: Boolean,
      required: false,
    },
  },

  computed: {
    highlighter() {
      if (!this.activeEl) return {};
      const rect = this.activeEl.getBoundingClientRect();
      const coords = {
        top: rect.top + "px",
        left: rect.left + "px",
        width: this.activeEl.offsetWidth + "px",
        height: this.activeEl.offsetHeight + "px",
        "pointer-events": this.mouseMoving ? "none" : "initial",
        cursor: this.mouseMoving ? "initial" : "pointer",
      };
      return coords;
    },
  },

  data() {
    return {
      highlightTimer: null,
      dragging: false,
      activeEl: null,
      showHighlight: false,
      activeKey: "vuex",
      open: false,
      dataSource: this.$store ? this.$store.state : null,
      targeting: false,
      targeted: undefined,
      mouseMoving: false,
    };
  },
};
</script>

<style lang="stylus">

  @require "./vars.styl"

  @keyframes debugger-zoom-in {
    from {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    50% {
      opacity: 1;
    }
  }

  @keyframes debugger-zoom-out {
    from {
      opacity: 1;
    }

    50% {
      opacity: 0;
      -webkit-transform: scale3d(.3, .3, .3);
      transform: scale3d(.3, .3, .3);
    }

    to {
      opacity: 0;
    }
  }

  .debugger-highlight-enter-active
    animation: debugger-zoom-in .2s ease

  .debugger-highlight-leave-active
    animation: debugger-zoom-out .5s ease

  .vue-debugger-container
    z-index: 100000

    .vue-debugger.highlighter
      position: fixed
      transition: all .3s ease-in-out
      background-color: rgba($debug-aqua, 0.25)
      border: 5px solid rgba($debug-aqua, 0.45)
      border-radius: 5px
      top: 0
      left: 0
      width: 200px
      height: 200px
      z-index: 1000

      h4
        display: inline-block
        background-color: white
        border-radius: 3px
        padding: 0 1rem

    a
      cursor: pointer !important

    .vue-debugger.nav-pane, .vue-debugger.main-pane

      &::-webkit-scrollbar
        width: 10px

      &::-webkit-scrollbar-thumb
        background: rgba($debug-purple, 0.3)
        border-radius: 5px

      &::-webkit-scrollbar-track
        background: transparent

    .vue-debugger.pane
      font-family: Monaco, monospace
      font-size: 14px
      position: fixed
      top: 100%
      left: 0
      color: $debug-tan
      width: 100vw
      height: 50%
      z-index: 1000
      text-rendering: optimizeLegibility

      .drag-handle
        width: 100%
        box-shadow: 0px 0px 6px rgba(black, 0.5)
        height: $drag-bar-height
        background-color: lighten($debug-medium, 20%)
        border-top: 1px solid lighten($debug-medium, 35%)
        border-bottom: 1px solid lighten($debug-medium, 15%)
        // position: absolute
        cursor: ns-resize
        text-align: center

        &:before
          content:'\2630'
          color: lighten($debug-medium, 65%)

      .vue-debugger.toggle, .vue-debugger.target
        padding: .5em
        // background-color: $debug-medium
        position: absolute
        top: -2.3em
        right: 0
        font-size: 2em
        z-index: 1000
        cursor: pointer
      .vue-debugger.target
        right: 56px
        color: black

        &.active
          color: red

    .type, .count, .toolbar .btn
      opacity: .4
      background-color: $debug-purple
      border-radius: 1em
      font-size: 10px
      padding: .1em .6em
      font-weight: bold
      cursor: pointer
      color: $debug-dark

      &.count
        background-color: $debug-yellow

      &.reload
        background-color: $debug-red
        color: white
        font-weight: bold

      &.json
        background-color: $debug-aqua
        margin-left: .5em

      &:hover
        opacity: .9

      &.Array
        background-color: $debug-yellow

      &:empty
        display: none

    .toolbar
      display: none
      position: absolute
      opacity: 0
      top: 6px
      right: 0
      z-index: 1000000
      transition: all .2s ease
      justify-content: flex-end

      .btn
        // opacity: 1 !important
        background-color: $debug-aqua
        color: darken($debug-aqua, 70%)
        border-radius: 0
        opacity: 0.8
        border-right: 1px solid darken($debug-aqua, 20%)
        border-left: 1px solid lightene($debug-aqua, 20%)

        &:last-child
          border-right: none
          border-top-right-radius: 1em
          border-bottom-right-radius: 1em

        &:first-child
          border-left: none
          border-top-left-radius: 1em
          border-bottom-left-radius: 1em


    .vue-debugger.nav-pane
      box-sizing: border-box
      width: $debug-nav-width
      display: inline-block
      float: left
      height: 100%
      overflow: auto
      padding: $debug-padding
      padding-right: 0
      background-color: rgba($debug-dark, 0.95)
      border-right: 1px solid darken($debug-dark, 10%)

      ul, li
        list-style: none
        padding: 0

      ul
        padding: 0
        padding-left: $debug-padding

      > ul
        margin: 0
        padding: 0

      li
        padding: .3em
        padding-right: 0
        color: $debug-purple
        position: relative


        &.children:before
          position: absolute
          left: -12px
          content: '▸'

        &.children.opened:before
          content: '▾'

        a
          color: inherit
          display: block
          font-weight: bold

          &:hover
            .toolbar
              opacity: 1
              display: flex

        &.active
          color: $debug-yellow



    .vue-debugger.main-pane
      padding: $debug-padding 0 ($debug-padding*2) 0
      box-sizing: border-box
      background-color: rgba($debug-medium, 0.95)
      display: inline-block
      float: left
      width: 'calc(100% - %s)' % $debug-nav-width
      height: 100%
      overflow: auto
      color: $debug-white
      line-height: 1.7em
      border-left: 1px solid lighten($debug-medium, 12%)

      .obj-tree
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

    .obj-tree:not(.empty) > .key:hover
      color: lighten($debug-blue, 60%)

    .vue-debugger.main-pane .obj-tree.open
      > .key.Array, > .key.Object
        &:before
          content: '▾'

      > .container
        display: inline

</style>
