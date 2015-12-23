'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const url = require('url');
const box = require('../../../core/src/provision/box');
const ei = require('../../../core/src/util/element-instances')

describe('files apis', () => {
  it('should throw a 404 when trying to find an invalid file', () => {
    var uri = '/hubs/documents/files/-1';
    return chakram.get(uri).then((r) => {
      expect(r).to.have.status(404);
    });
  });
});
