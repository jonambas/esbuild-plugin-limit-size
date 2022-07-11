# esbuild-plugin-limit-size

A tiny (2kb) bundle size limiter plugin for esbuild.

```js
const { build } = require('esbuild');
const { limitSizePlugin } = require('esbuild-plugin-limit-size');

build({
  ...yourOptions,
  plugins: [limitSizePlugin(limit, shouldThrow)]
}).catch(() => process.exit(1));
```

### Plugin Args

##### `limit`

Type: `number` Default: `500`

Sets the bundle size limit in KBs. This plugin at the moment only checks outputted `.js` files.

##### `shouldThrow`

Type: `boolean` Default: `false`

When this is set to `true`, and the provided limit has been exceeded, the plugin will throw an error.
