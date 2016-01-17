'use strict';

const churrosUtil = require('core/churros-util');

var exports = module.exports = {};

exports.gen = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + churrosUtil.random())
});
