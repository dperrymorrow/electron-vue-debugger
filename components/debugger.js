"use strict";

const throttle = require("lodash.throttle");
const debounce = require("lodash.debounce");

module.exports = {
  name: "debugger",

  template: `
    <div class="vue-debugger-container" @click.prevent.stop="">
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
  `,

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
