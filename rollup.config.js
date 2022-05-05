import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: !production,
    name: 'scraper',
    file: 'build/scraper.mjs',
  },
  plugins: [
    typescript(),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
