'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const candidatesPayload = require('./assets/candidates');

const updatePayload = {
  "name": "John Snow",
  "firstName": "John",
  "lastName": "Snow"
};

suite.forElement('crm', 'candidates', { payload: candidatesPayload }, (test) => {
  const build = (overrides) => Object.assign({}, candidatesPayload, overrides);
  const payload = build({ name: tools.random, firstName: tools.random(), lastName: tools.random()});
  it('should create a candidate and then get, put, delete candidate by Id', () => {
    let candidateId;
    return cloud.post(test.api, payload)
      .then(r => candidateId = r.body.data.data.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${candidateId}`))
      .then(r => cloud.put(`${test.api}/${candidateId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${candidateId}`));
  });
});
