const churrosUtil = require('../../core/src/util/churros-util');

var exports = module.exports = {};

exports.gen = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + churrosUtil.random())
});
