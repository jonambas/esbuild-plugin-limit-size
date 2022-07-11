# esbuild-plugin-limit-size

A tiny (2kb) bundle size limiter/reporter plugin for esbuild.

![A4 - 1](https://user-images.githubusercontent.com/3903325/178270943-f43350ba-828f-4a0b-a839-8d2bc7d3a12f.png)

```js
const { build } = require('esbuild');
const { limitSizePlugin } = require('esbuild-plugin-limit-size');

build({
  ...yourOptions,
  plugins: [limitSizePlugin(limit, exit)]
}).catch(() => process.exit(1));
```


### Plugin Args

##### `limit`

Type: `number` Default: `500`

Sets the bundle size limit in KBs. This plugin at the moment only checks outputted `.js` files.

##### `exit`

Type: `boolean` Default: `false`

When this is set to `true`, and the provided limit has been exceeded, the plugin will exit with `process.exit(1)`
