'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const common = require('../common');

describe('folders', () => {
  common.for('folders');

  it('should allow listing folder contents', () => {
    var uri = '/hubs/documents/folders/contents';
    return chakram.get(uri + '?path=/')
      .then(r => {
        expect(r).to.have.status(200);
      });
  });
});
