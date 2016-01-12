'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const ei = require('core/util/element-instances')

describe('files', () => {
  it('should throw a 404 when trying to find an invalid file', () => {
    var uri = '/hubs/documents/files/-1';
    return chakram.get(uri).then((r) => {
      expect(r).to.have.status(404);
    });
  });
});
