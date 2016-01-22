'use strict';

const util = require('util');
const chocolate = require('core/chocolate');
const chakram = require('chakram');
const expect = chakram.expect;
const tester = require('core/tester');
const fs = require('fs');
const schema = require('./assets/files.schema.json');

tester.for('crm', 'files', () => {
  it('should allow uploading and downloading a file', () => {
    const fullPath = util.format('/brady-%s.jpg', chocolate.random());
    var fileId = -1;
    return chakram.post('/hubs/documents/files', undefined, {
        formData: {
          file: fs.createReadStream(__dirname + '/assets/brady.jpg')
        },
        qs: {
          path: fullPath
        }
      })
      .then(r => {
        expect(r).to.have.schemaAnd200(schema);
        fileId = r.body.id;
        return chakram.get('/hubs/documents/files/' + fileId);
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
        return chakram.delete('/hubs/documents/files/' + fileId);
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
      });
  });
});
