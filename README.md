# Debugger Component


## Install
> component must be registered.

``` javascript
Vue.use(require('@welocalize/useful-shit').vue.components);
```

### Require the styles
> this assumes that you have `-I node_modules` added as a path to your stylus compile script.

```stylus
@require '@welocalize/useful-shit/src/vue/components/debugger/*'
```

### Add the Component to your main app file.
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
