/* eslint-disable array-func/prefer-array-from */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';

// eslint-disable-next-line import/extensions
import pkg from './package.json' with { type: 'json' };

const globals = {};

export default [
    {
        external: [
            '@emotion/hash',
            '@emotion/is-prop-valid',
            '@emotion/memoize',
            '@emotion/styled/base',
            '@emotion/serialize',
            '@emotion/unitless',
            '@emotion/use-insertion-effect-with-fallbacks',
            '@emotion/utils',
            ...Object.keys({
                ...pkg.dependencies,
                ...pkg.devDependencies,
                ...pkg.peerDependencies
            } || {})
        ],
        input: 'src/index.ts',
        output: [
            {
                exports: 'named',
                file: pkg.exports['.'].require,
                format: 'cjs',
                globals,
                interop: 'auto',
                name: pkg.name,
                sourcemap: true
            },
            {
                dir: './dist/esm/',
                exports: 'named',
                format: 'es',
                globals,
                name: pkg.name,
                preserveModules: true,
                sourcemap: true
            }
        ],
        plugins: [
            cleaner({targets: ['./dist/']}),
            resolve({extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']}),
            commonjs({include: ['node_modules/**']}),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
            })
        ]
    },
    {
        external:  [
            ...Object.keys({
                ...pkg.dependencies,
                ...pkg.devDependencies,
                ...pkg.peerDependencies
            } || {})
        ],
        input: 'src/cypress/commands.ts',
        output: [
            {
                file: pkg.exports['./cypress'].require.default,
                format: 'cjs',
                globals: {Cypress: 'cypress'},
                interop: 'auto',
                sourcemap: true
            },
            {
                file: pkg.exports['./cypress'].import.default,
                format: 'es',
                globals: {Cypress: 'cypress'},
                sourcemap: true
            }
        ],
        plugins: [
            resolve({extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']}),
            commonjs({include: ['node_modules/**']}),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
            }),
            copy({
                targets: [
                    {
                        dest: './dist/cypress/types',
                        src: './src/cypress/types/*'
                    }
                ]
            })
        ]
    }
];