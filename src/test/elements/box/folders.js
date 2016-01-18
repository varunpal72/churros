'use strict';

const chakram = require('chakram');
const expect = chakram.expect;

describe('folders', () => {
  it('should allow listing folder contents', () => {
    var uri = '/hubs/documents/folders/contents';
    return chakram.get(uri + '?path=/')
      .then(r => {
        expect(r).to.have.status(200);
      });
  });
});
