'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

var exports = module.exports = {};

exports.for = (objectName) => {
  const name = util.format('should throw a 404 when trying to retrieve a %s that does not exist', objectName);
  it(name, () => {
    var uri = util.format('/hubs/crm/%s/-1', objectName);
    return chakram.get(uri)
      .then(r => {
        expect(r).to.have.status(404);
      });
  });
};
