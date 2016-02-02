'use strict';

const util = require('util');
const chocolate = require('core/chocolate');
const expect = require('chakram').expect;
const tester = require('core/tester');
const schema = require('./assets/file.schema.json');

tester.for('documents', 'files', (api) => {
  it('should allow uploading and downloading a file', () => {

    let fileId = -1;
    let query = {
      path: util.format('/brady-%s.jpg', chocolate.random())
    };
    let path = __dirname + '/assets/brady.jpg';

    return tester.postFile(api, path, query, schema)
      .then(r => {
        fileId = r.body.id;
        return tester.get(api + '/' + fileId, (r) => expect(r).to.have.statusCode(200));
      })
      .then(r => tester.delete('/hubs/documents/files/' + fileId));
  });
});
