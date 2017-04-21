'use strict';

const components = require('./components');

module.exports = {
  install(Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key]);
    });
  },
};
