'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('esignature', 'transient-documents', {skip: true}, (test) => {
  it(`should allow POST for /transient-documents`, () => {
    return cloud.postFile(test.api, `${__dirname}/assets/attach.txt`);
  });
});
