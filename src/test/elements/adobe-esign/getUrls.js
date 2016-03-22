'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;

suite.forElement('esignature', 'geturls', null, (test) => {
  test.should.return200OnGet();
});
