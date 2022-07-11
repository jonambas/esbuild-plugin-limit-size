#!/usr/bin/env node
const { build } = require('esbuild');
const pkg = require('./package.json');
const fs = require('fs');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: 'linked',
  format: 'cjs',
  platform: 'node',
  outfile: pkg.main
})
  .then(() => {
    const stats = fs.statSync(pkg.main);
    console.log(`Size: ${(stats.size / 1024).toFixed(2)} kb`);
  })
  .catch(() => process.exit(1));
