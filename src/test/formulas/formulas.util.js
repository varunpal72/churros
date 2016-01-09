'use strict';

const churrosUtil = require('core/util/churros-util');

var exports = module.exports = {};

exports.gen = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + churrosUtil.random())
});
