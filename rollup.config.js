import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './src/index.js',
  output: {
    file: './dist/datepicker.js',
    format: 'umd',
    name: 'Datepicker'
  },
  plugins: [
    babel(),
    uglify()
  ]
};
