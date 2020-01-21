import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import flow from 'rollup-plugin-flow';

export default {
    input: pkg.main,
    output: {
        file: 'build/bundle.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        flow({ all: true }),
    ],
    external: Object.keys(pkg.dependencies),
};
