#!/usr/bin/env node
const { build } = require('esbuild');
const { limitSizePlugin } = require('../dist');

describe('plugin', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should throw', async () => {
    try {
      await build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        metafile: true,
        plugins: [limitSizePlugin(1, true)],
        logLevel: 'silent'
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('Limit of 1kb exceeded');
    }
  });

  it('should not throw', async () => {
    try {
      await build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        metafile: true,
        plugins: [limitSizePlugin(10, false)],
        logLevel: 'silent'
      });
    } catch (e) {
      // Should not happen
      expect(true).toBe('never');
    }
  });

  it('should log', async () => {
    try {
      await build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        metafile: true,
        plugins: [limitSizePlugin(10, false)],
        logLevel: 'silent'
      });
    } catch (e) {
      // Should not happen
      expect(true).toBe('never');
    }
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log.mock.calls[0][0]).toContain('index.js');
  });
});
