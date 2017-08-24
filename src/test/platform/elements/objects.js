'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const schema = require('./assets/element.object.schema.json');
const payload = require('./assets/element.object.payload.json');

const opts = { payload: payload, schema: schema };

const crudsObject = (url, schema, payload, updatePayload) => {
  return cloud.post(url, payload, schema)
    .then(r => cloud.get(url + '/' + payload.name))
    .then(r => cloud.put(url + '/' + payload.name, updatePayload, schema))
    .then(r => cloud.delete(url + '/' + payload.name));
};

const genObject = (opts) => {
  const newPayload = payload[0] || {};
  newPayload.createdDateName = (opts.createdDateName || 'created_dt');
  return newPayload;
};

suite.forPlatform('elements/objects', opts, (test) => {
  let element, keyUrl, idUrl;
  before(() => cloud.get(`elements/closeio`)
    .then(r => element = r.body)
    .then(r => keyUrl = `elements/${element.key}/objects`)
    .then(r => idUrl = `elements/${element.id}/objects`));

  it('should support CRUD by key', () => crudsObject(keyUrl, schema, genObject({}), genObject({ createdDateName: "created_date" })));
  it('should support CRUD by key', () => crudsObject(idUrl, schema, genObject({}), genObject({ createdDateName: "created_date" })));

});
