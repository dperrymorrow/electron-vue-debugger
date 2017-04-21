# Debugger Component


## Install

```
npm install electron-vue-debugger -save-dev
```
> component must be registered.

``` javascript
Vue.use(require('electron-vue-debugger'));
```

## Add the Component to your main app file.

> keepAlive will determine if the debugger keeps state when open and closed, if false, the panel does not render when not opened. This can help with performance.

```html
<debugger :keepAlive="true" :components="$children"></debugger>
```

You will most likely only render this component in development so a conditional like the following will be warranted.

```html
<debugger v-if="CONFIG.debug" :keepAlive="true" :components="$children"></debugger>
```

> `Control ⌃ + d` toggle the debugger panel

thats it, enjoy...
