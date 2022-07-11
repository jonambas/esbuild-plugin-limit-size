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
      const { dim, green, red, yellow } = require('picocolors');

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
          const color = !isJs ? dim : size.bytes > limit ? red : green;

          console.log(
            color(
              `${size.file.padEnd(fileMax + 4)}${`${size.bytes}`.padStart(sizeMax)} KB`
            )
          );
        }

        if (exceeded) {
          const color = shouldThrow ? red : yellow;
          console.log(color(`\n(!) Some bundles are larger than ${limit} KB\n`));
        }

        if (shouldThrow && exceeded) {
          throw new Error(`Size limit of ${limit} KB exceeded`);
        }
      });
    }
  };
};
