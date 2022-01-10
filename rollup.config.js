import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import svg from 'rollup-plugin-svg'
import cjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import path from 'path'

const dev = process.env.NODE_ENV !== 'production'

export default {
  input: 'src/scripts/main.js',
  output: {
    sourcemap: false,
    format: 'iife',
    name: 'main',
    file: 'dist/assets/main.bundle.js',
  },
  plugins: [
    replace({
      DEV_MODE: dev,
      preventAssignment: true,
    }),
    svg(),
    postcss({
      extract: path.resolve('dist/assets/main.bundle.css'),
      minimize: !dev,
    }),
    node(),
    cjs(),
    !dev && terser(),
  ],
  watch: {
    clearScreen: false,
  },
  onwarn: function (warning, superOnWarn) {
    /*
     * skip certain warnings
     * https://github.com/openlayers/openlayers/issues/10245
     */
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return
    }
    superOnWarn(warning)
  },
}
