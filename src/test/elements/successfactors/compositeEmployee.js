'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/compositeEmployee.json`);
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('Humancapital', 'composite-employee', { payload: payload }, (test) => {
  test.should.return200OnPost();
});
