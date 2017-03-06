'use strict';

const suite = require('core/suite');
const payload = require('./assets/optouts');
const fs = require('fs');
const cloud = require('core/cloud');

suite.forElement('marketing', 'optouts', { payload: payload }, (test) => {
  test.should.return200OnGet();
  it('should allow PUT on optouts', () => {
    let documentPath = __dirname + '/assets/test.csv';
    const putDocuments = { formData: { file: fs.createReadStream(documentPath) } };
    return cloud.withOptions(putDocuments).put(test.api, undefined);
  });
});