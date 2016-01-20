'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const common = require('../common');

describe('leads', () => {
  common.for('marketing','leads');
});
