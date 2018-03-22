import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

export default [
  // UITest
  {
    input: 'src/salt/ui/Test.main.js',
    output: {
      file: 'build/UITest.bundle.js',
      format: 'iife', // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
      name: 'UITest'
    },
    plugins: [
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [ ['env', { modules: false }], 'react', 'stage-0', 'flow' ],
        plugins: [ 'external-helpers' ]
      }),
      cjs({
        namedExports: {
          'node_modules/react-pixi-fiber/index.js': [ 'Stage', 'CustomPIXIComponent' ],
          'node_modules/pixi.js/lib/index.js': [ 'Graphics', 'DisplayObject' ],
          'node_modules/react/index.js': [ 'createElement', 'Component', 'Fragment', 'cloneElement', 'Children' ],
          'node_modules/react-dom/index.js': [ 'render' ]
        }
      }),
      // builtins(),
      // globals(),
      resolve({
        preferBuiltins: false
      })
    ]
  }
]
