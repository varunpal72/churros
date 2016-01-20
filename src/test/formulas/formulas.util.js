'use strict';

const chocolate = require('core/chocolate');

var exports = module.exports = {};

exports.gen = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + chocolate.random())
});
