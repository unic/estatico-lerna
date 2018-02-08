/* eslint-disable global-require, no-await-in-loop */
const { Plugin, Logger } = require('@unic/estatico-utils');
const Joi = require('joi');

// Config schema used for validation
const schema = Joi.object().keys({
  src: Joi.object().required(),
  srcBase: Joi.string().required(),
  watch: Joi.object().keys({
    src: [Joi.string().required(), Joi.array().required()],
    name: Joi.string().required(),
  }).allow(null),
  plugins: {
    svgstore: Joi.object(),
    imagemin: Joi.object().allow(null),
  },
  logger: Joi.object().keys({
    info: Joi.func(),
    error: Joi.func(),
    debug: Joi.func(),
  }),
});

/**
 * Default config
 * @param {object} env - Optional environment config, e.g. { dev: true }
 * @return {object}
 */
const defaults = (/* env */) => ({
  src: null,
  srcBase: null,
  dest: null,
  plugins: {
    svgstore: {
      inlineSvg: true,
    },
    imagemin: {
      svgoPlugins: [
        {
          cleanupIDs: {
            remove: false,
          },
        },
        {
          cleanupNumericValues: {
            floatPrecision: 2,
          },
        },
        {
          removeStyleElement: true,
        },
        {
          removeTitle: true,
        },
      ],
      multipass: true,
    },
  },
  logger: new Logger('estatico-svgsprite'),
});

/**
 * Task function
 * @param {object} config - Complete task config
 * @param {object} env - Environment config, e.g. { dev: true }
 * @param {object} [watcher] - Watch file events
 * @return {object} gulp stream
 */
const task = (config, env = {}) => {
  const gulp = require('gulp'); // eslint-disable-line global-require
  const plumber = require('gulp-plumber'); // eslint-disable-line global-require
  const svgstore = require('gulp-svgstore'); // eslint-disable-line global-require
  const imagemin = require('gulp-imagemin'); // eslint-disable-line global-require
  const mergeStream = require('merge-stream'); // eslint-disable-line global-require
  const through = require('through2'); // eslint-disable-line global-require
  const size = require('gulp-size'); // eslint-disable-line global-require
  const chalk = require('chalk'); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line global-require

  const sprites = Object.keys(config.src).map(spriteName => gulp.src(config.src[spriteName], {
    base: config.srcBase,
  })

    // Prevent stream from unpiping on error
    .pipe(plumber())

    // Imagemin
    .pipe(config.plugins.imagemin ? imagemin(config.plugins.imagemin).on('error', err => config.logger.error(err, env.dev)) : through.obj())

    // Svgstore
    .pipe(svgstore(config.plugins.svgstore).on('error', err => config.logger.error(err, env.dev)))

    // Rename
    .pipe(through.obj((file, enc, done) => {
      const filePath = file.path
        .replace(path.basename(file.path, path.extname(file.path)), spriteName);

      file.path = filePath; // eslint-disable-line no-param-reassign

      config.logger.info(`Generated ${chalk.yellow(path.resolve(config.dest, file.path))}`);

      done(null, file);
    }))

    // Log
    .pipe(size({
      showFiles: true,
      title: 'estatico-svgsprite',
    }))

    // Save
    .pipe(gulp.dest(config.dest)));

  if (sprites.length > 0) {
    return mergeStream(sprites);
  }

  return sprites;
};

/**
 * @param {object|func} options - Custom config
 *  Either deep-merged (object) or called (func) with defaults
 * @param {object} env - Optional environment config, e.g. { dev: true }, passed to defaults
 * @return {func} Task function from above with bound config and env
 */
module.exports = (options, env = {}) => new Plugin({
  defaults,
  schema,
  options,
  task,
  env,
});