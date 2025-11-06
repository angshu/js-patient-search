import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

const isProduction = process.env.BUILD === 'production';

const banner = `/**
 * Patient Search Library
 * @version 1.0.0
 * @author Angshus
 * @license MIT
 */`;

// Base plugins for all builds
const basePlugins = [
  resolve({
    browser: true
  }),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        }
      }]
    ]
  })
];

// Build configurations for different formats
const builds = [
  // UMD build with extracted CSS
  {
    input: 'src/patient-search.js',
    output: {
      file: 'dist/patient-search.js',
      format: 'umd',
      name: 'PatientSearch',
      banner,
      sourcemap: !isProduction,
      exports: 'default'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: isProduction,
        sourceMap: !isProduction
      }),
      ...basePlugins
    ]
  },
  
  // UMD minified build with extracted CSS
  {
    input: 'src/patient-search.js',
    output: {
      file: 'dist/patient-search.min.js',
      format: 'umd',
      name: 'PatientSearch',
      banner,
      sourcemap: isProduction,
      exports: 'default'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: isProduction,
        sourceMap: !isProduction
      }),
      ...basePlugins,
      terser({
        format: {
          comments: /^!/
        }
      })
    ]
  },
  
  // UMD build with INLINE CSS (bundled into JS)
  {
    input: 'src/patient-search.js',
    output: {
      file: 'dist/patient-search.bundle.js',
      format: 'umd',
      name: 'PatientSearch',
      banner,
      sourcemap: !isProduction,
      exports: 'default'
    },
    plugins: [
      postcss({
        inject: true,  // Inject CSS into JS
        minimize: isProduction
      }),
      ...basePlugins
    ]
  },
  
  // UMD minified build with INLINE CSS (bundled into JS)
  {
    input: 'src/patient-search.js',
    output: {
      file: 'dist/patient-search.bundle.min.js',
      format: 'umd',
      name: 'PatientSearch',
      banner,
      sourcemap: isProduction,
      exports: 'default'
    },
    plugins: [
      postcss({
        inject: true,  // Inject CSS into JS
        minimize: isProduction
      }),
      ...basePlugins,
      terser({
        format: {
          comments: /^!/
        }
      })
    ]
  },
  
  // ES Module build with extracted CSS
  {
    input: 'src/patient-search.js',
    output: {
      file: 'dist/patient-search.esm.js',
      format: 'es',
      banner,
      sourcemap: !isProduction,
      exports: 'default'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: isProduction,
        sourceMap: !isProduction
      }),
      ...basePlugins
    ]
  },
  
  // CommonJS build with extracted CSS
  {
    input: 'src/patient-search.js',
    output: {
      file: 'dist/patient-search.cjs.js',
      format: 'cjs',
      banner,
      sourcemap: !isProduction,
      exports: 'default'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: isProduction,
        sourceMap: !isProduction
      }),
      ...basePlugins
    ]
  }
];

export default builds;
