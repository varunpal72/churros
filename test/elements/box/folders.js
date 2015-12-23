'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const url = require('url');
const box = require('../../../core/src/provision/box');
const ei = require('../../../core/src/util/element-instances')

describe('folders apis', () => {
  it('should allow listing folder contents', () => {
    var uri = '/hubs/documents/folders/contents';
    return chakram.get(uri + '?path=/').then((r) => {
      expect(r).to.have.status(200);
    });
  });
});
