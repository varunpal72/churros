'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

var exports = module.exports = {};

exports.crd = function (api, payload, schema) {
  return chakram.post(api, payload)
    .then((r) => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);
      return chakram.get(util.format('%s/%s', api, r.body.id));
    })
    .then((r) => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);
      return chakram.delete(util.format('%s/%s', api, r.body.id));
    })
    .then((r) => {
      expect(r).to.have.status(200);
    });
};

exports.crud = function (api, payload, schema) {
  return chakram.post(api, payload)
    .then((r) => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);
      return chakram.get(util.format('%s/%s', api, r.body.id));
    })
    .then((r) => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);
      return chakram.put(util.format('%s/%s', api, r.body.id), payload);
    })
    .then((r) => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);
      return chakram.delete(util.format('%s/%s', api, r.body.id));
    })
    .then((r) => {
      expect(r).to.have.status(200);
    });
};
