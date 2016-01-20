'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const common = require('../common');

describe('contacts', () => {
  common.for('crm','contacts');
});
