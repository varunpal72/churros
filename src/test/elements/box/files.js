'use strict';

const chakram = require('chakram');
const expect = chakram.expect;

describe('files', () => {
  it('should throw a 404 when trying to retrieve a file that does not exist', () => {
    var uri = '/hubs/documents/files/-1';
    return chakram.get(uri)
    .then(r => {
      expect(r).to.have.status(404);
    });
  });
});
