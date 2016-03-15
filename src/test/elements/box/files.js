'use strict';

const util = require('util');
const tools = require('core/tools');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('documents', 'files', null, (test) => {
  it('should allow uploading, downloading, and locking a file', () => {
    let fileId = -1;
    let query = { path: util.format('/brady-%s.jpg', tools.random()) };
    let path = __dirname + '/assets/brady.jpg';

    return cloud.postFile(test.api, path, { qs: query })
      .then(r => fileId = r.body.id)
      .then(r => cloud.get(test.api + '/' + fileId, (r) => expect(r).to.have.statusCode(200)))
      .then(r => cloud.patch(test.api + '/' + fileId + '/lock', (r) => expect(r).to.have.statusCode(200)))
      .then(r => cloud.patch(test.api + '/' + fileId + '/unlock', (r) => expect(r).to.have.statusCode(200)))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });
});
