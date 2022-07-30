import type { Plugin } from 'esbuild';

export const limitSizePlugin = (
  /*!
   * Limit in KBs
   */
  limit = 500,
  /*!
   * Whether to execute throw an error if limit is exceeded
   */
  shouldThrow = false
): Plugin => {
  return {
    name: 'limit-size-plugin',
    setup(build) {
      const { dim, cyan, red } = require('picocolors');

      if (!build.initialOptions.metafile) {
        build.initialOptions.metafile = true;
      }

      build.onEnd((result) => {
        let exceeded = false;
        const outputs = result.metafile?.outputs;

        if (!outputs) {
          console.log(dim(`\`metafile\` option must be turned on`));
          return;
        }

        const sizes = Object.keys(outputs).map((k) => ({
          file: k,
          bytes: Number((outputs[k].bytes / 1024).toFixed(2))
        }));

        const fileMax = Math.max(...sizes.map(({ file }) => file.length));
        const sizeMax = Math.max(...sizes.map(({ bytes }) => `${bytes}`.length));

        for (const size of sizes) {
          const isJs = size.file.match(/.js$/);
          exceeded = !!exceeded ? true : isJs ? size.bytes > limit : false;
          const color = !isJs ? dim : size.bytes > limit ? red : cyan;
          console.log(
            color(
              `${size.file.padEnd(fileMax + 2)}${`${size.bytes}`.padStart(sizeMax)}kb`
            )
          );
        }

        if (shouldThrow && exceeded) {
          throw new Error(`Limit of ${limit}kb exceeded`);
        }

        if (!exceeded) {
          console.log(cyan(`\n✓ Under ${limit}kb limit`));
        }
      });
    }
  };
};
