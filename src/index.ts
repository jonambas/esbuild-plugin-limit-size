import type { Plugin } from 'esbuild';

export const limitSizePlugin = (
  /*!
   * Limit in KBs
   */
  limit = 500,
  /*!
   * Whether to execute `process.exit(1)` if limit is exceeded
   */
  exit = false
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

        const keys = Object.keys(outputs);
        const fileMax = Math.max(...keys.map((k) => k.length));
        const sizeMax = Math.max(
          ...keys.map((k) => `${outputs[k].bytes / 1024}`.length)
        );

        for (const file in outputs) {
          const isJs = file.match(/.js$/);
          const size = outputs[file].bytes / 1024;
          exceeded = !!exceeded ? true : isJs ? size > limit : false;
          const color = !isJs ? dim : size > limit ? red : green;

          console.log(
            color(
              `${file.padEnd(fileMax + 4)}${`${size.toFixed(
                2
              )}`.padStart(sizeMax)} KB`
            )
          );
        }

        if (exceeded) {
          const color = exit ? red : yellow;

          console.log(
            color(`\n(!) Some bundles are larger than ${limit} KB\n`)
          );
        }

        if (exit && exceeded) {
          process.exit(1);
        }
      });
    }
  };
};
