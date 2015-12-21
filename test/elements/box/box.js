'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const url = require('url');
const box = require('../../../core/src/provision/box');
const ei = require('../../../core/src/util/element-instances')

describe('box apis', () => {
  var instanceId = 0;

  before((done) => {
    box.create().then((r) => {
      instanceId = r.body.id;
      console.log('Created element instance with ID: ' + instanceId);
      done();
    });
  });

  it('should allow listing folder contents', () => {
    var uri = '/hubs/documents/folders/contents';
    return chakram.get(uri + '?path=/').then((r) => {
      expect(r).to.have.status(200);
    });
  });

  after((done) => {
    ei.delete(instanceId).then(() => {
      done();
    });
  });
});
