const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

this.crd = function (api, payload, schema) {
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

this.crud = function (api, payload, schema) {
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
