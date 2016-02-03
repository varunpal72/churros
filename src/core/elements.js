'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const chocolate = require('core/chocolate');
const props = require('core/props');

var exports = module.exports = {};

const get = (element) => {
  return chakram.get(util.format('/elements/%s', element))
    .catch(r => chocolate.logAndThrow('Failed to retrieve element %s', r, element));
};
exports.get = get;