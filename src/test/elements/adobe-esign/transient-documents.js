'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('esignature', 'transient-documents', null, (test) => {
  it(`should allow POST for /transient-documents`, () => {
    return cloud.postFile(test.api, `${__dirname}/assets/attach.txt`)
  });
});