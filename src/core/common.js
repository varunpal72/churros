'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

var exports = module.exports = {};

exports.for = (hub, objectName, tests) => {
  describe(objectName, () => {
    const name = util.format('should throw a 404 when trying to retrieve a(n) %s that does not exist', objectName);
    it(name, () => {
      var uri = util.format('/hubs/%s/%s/-1', hub, objectName);
      return chakram.get(uri)
        .then(r => {
          expect(r).to.have.status(404);
        });
    });

    if (tests) tests();
  })
};

exports.crud = (api, payload, schema, updateCallback) => {
  return chakram.post(api, payload)
    .then(r => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);
      return chakram.get(util.format('%s/%s', api, r.body.id));
    })
    .then(r => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);

      // if no update callback was passed, then we're assuming this resource does *not* support update so just continue
      if (updateCallback) return updateCallback(util.format('%s/%s', api, r.body.id), payload);
      else return r;
    })
    .then(r => {
      expect(r).to.have.status(200);
      expect(r).to.have.schema(schema);
      return chakram.delete(util.format('%s/%s', api, r.body.id));
    })
    .then(r => {
      expect(r).to.have.status(200);
    });
};
