'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;

suite.forElement('esignature', 'geturls', null, (test) => {
  it('should allow GET for ' + '/hubs/esignature/geturls', () => {
    return cloud.get(test.api)
      .then(r => expect(r).to.have.statusCode(200))
  });
});
