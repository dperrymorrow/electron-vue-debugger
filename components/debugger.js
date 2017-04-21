'use strict';

const fs = require('fs');

module.exports = {
  name: 'debugger',

  template: `
    <div class="vue-debugger-container" @click.prevent.stop="">

      <transition name="debugger-highlight">
        <div class="vue-debugger highlighter" :style="highlighter" v-if="showHighlight"></div>
      </transition>

      <div class="vue-debugger pane" :class="{ opened: open }">

        <div class="drag-handle" @mousedown.stop.prevent="dragging = true"></div>
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
    fs.readFile(__dirname + '/../styles/debugger.css', (err, styles) => {
      const tag = document.createElement('style');

      console.log(styles);
      tag.innerText = styles;
      document.body.appendChild(tag);
      // document.appendText(`<style>${styles}</style>`);
    });

    window.addEventListener('keydown', this.shortcuts);
    window.addEventListener('mouseup', this.disableDrag);
    window.addEventListener('mousemove', this.drag);
    window.addEventListener('resize', this.updateHeight);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.shortcuts);
    window.removeEventListener('mouseup', this.disableDrag);
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('resize', this.updateHeight);
  },

  methods: {
    shortcuts(ev) {
      if (ev.ctrlKey && ev.code == 'KeyD') this.toggle();
    },
    disableDrag() {
      this.dragging = false;
    },
    showKey(key) {
      this.activeKey = key;
    },
    toggle() {
      this.open = !this.open;
      this.$el.querySelector('.vue-debugger.pane').removeAttribute('style');

      let storedY = localStorage.getItem('debugger-y');
      const pane = this.$el.querySelector('.vue-debugger.pane');

      if (storedY > document.body.offsetHeight) {
        storedY = null;
        localStorage.setItem('debugger-y', null);
      }

      if (this.open) {
        if (storedY && storedY !== 'null') {
          pane.style.top = storedY + 'px';
        } else {
          pane.style.top = '50%';
        }

        this.updateHeight();
      }
    },
    clearStore() {
      localStorage.setItem('debugger-y', null);
    },
    drag(event) {
      const pane = this.$el.querySelector('.vue-debugger.pane');
      if (this.dragging) {
        let top = event.pageY;
        top = top > document.body.offsetHeight
          ? document.body.offsetHeight
          : top;
        pane.style.top = top + 'px';
        localStorage.setItem('debugger-y', top);
        this.updateHeight();
      }
    },
    updateHeight() {
      const pane = this.$el.querySelector('.vue-debugger.pane');
      pane.style.height =
        document.body.offsetHeight - parseInt(pane.style.top) + 'px';
    },
    dataChange(args) {
      this.activeKey = args.id;
      this.dataSource = args.data;
      this.activeEl = args.element ? args.element : null;
      this.showHighlight = this.activeEl !== null;

      if (this.highlightTimer) clearTimeout(this.highlightTimer);

      if (this.showHighlight) {
        this.highlightTimer = setTimeout(() => {
          this.showHighlight = false;
          this.highlightTimer = null;
        }, 1500);
      }
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
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: this.activeEl.offsetWidth + 'px',
        height: this.activeEl.offsetHeight + 'px',
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
      activeKey: 'vuex',
      open: false,
      dataSource: this.$store ? this.$store.state : null,
    };
  },
};
