# @unic/estatico-puppeteer

Uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) to check for JS errors and run tests

## Installation

```
$ npm install --save-dev @unic/estatico-puppeteer
```

## Usage

```js
const gulp = require('gulp');
const env = require('minimist')(process.argv.slice(2));

/**
 * JavaScript testing task
 * Uses Puppeteer to check for JS errors and run tests
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('js:test', () => {
  const task = require('@unic/estatico-puppeteer');

  const instance = task({
    src: [
      './dist/{pages,modules,demo}/**/*.html',
    ],
    srcBase: './dist',
    watch: {
      src: [
        './src/**/*.test.js',
      ],
      name: 'js:test',
    },
    viewports: {
      mobile: {
        width: 400,
        height: 1000,
        isMobile: true,
      },
      // tablet: {
      //   width: 700,
      //   height: 1000,
      //   isMobile: true,
      // },
      desktop: {
        width: 1400,
        height: 1000,
      },
    },
    plugins: {
      pool: {
        // How many pages to open in parallel
        max: 10,
      },
      interact: async (page) => {
        // Run some tests and log results (or throw an error)
      },
    },
  }, env);
  
  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});
```

Run task (assuming the project's `package.json` specifies `"scripts": { "gulp": "gulp" }`):
`$ npm run gulp js:test`

See possible flags specified above.

## API

`plugin(options, env)` => `taskFn`

### options

#### src (required)

Type: `Array` or `String`<br>
Default: `null`

Passed to `gulp.src`.

#### srcBase (required)

Type: `String`<br>
Default: `null`

Passed as `base` option to `gulp.src`.

#### watch

Type: `Object`<br>
Default: `null`

Passed to file watcher when `--watch` is used.

#### viewports

Type: `Object`<br>
Default: `null`

Every item is passed to Puppeteer's [`setViewport`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetviewportviewport).

#### plugins

Type: `Object`

##### plugins.puppeteer

Type: `Object`<br>
Default: `null`

Passed to [Puppeteer](https://github.com/GoogleChrome/puppeteer).

##### plugins.pool

Type: `Object`<br>
Default: `{ max: 10 }`

Passed to [generic-pool](https://www.npmjs.com/package/generic-pool). This allows you to open multiple pages in parallel, speeding up whatever task you are running.

##### plugins.interact

Type: `async fn(page)`<br>
Default: `null`

Interact with page (evaluating code, taking screenshots etc.). See [Puppeteer](https://github.com/GoogleChrome/puppeteer) for available API on `page` object.

#### logger

Type: `{ info: Function, debug: Function, error: Function }`<br>
Default: Instance of [`estatico-utils`](../estatico-utils)'s `Logger` utility.

Set of logger utility functions used within the task.

### env

Type: `Object`<br>
Default: `{}`

Result from parsing CLI arguments via `minimist`, e.g. `{ dev: true, watch: true }`. Some defaults are affected by this, see above.

## License

Apache 2.0.
