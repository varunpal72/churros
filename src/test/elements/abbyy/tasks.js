'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const common = require('../common');

describe('tasks', () => {
  common.for('ocr','tasks');
});
