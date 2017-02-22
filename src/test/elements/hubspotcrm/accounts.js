'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
const cloud = require('core/cloud');
var accountsId = 285826161;
suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  test.should.supportPagination();
  it('should test CRUD for /accounts and GET /accounts/{id}/activities', () => {
    const updatePayload = {
      "properties": {
        "name": tools.random()
      }
    };
    let accountId;
    const options = { qs: { pageSize: 1 } };
    return cloud.post(test.api, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.get(`${test.api}/${accountId}`))
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${accountId}/activities`))
      .then(r => cloud.withOptions(options).get(`${test.api}/${accountId}/activities`))
      .then(r => options.qs.nextPage = r.response.headers['elements-next-page-token'])
      .then(r => cloud.withOptions(options).get(`${test.api}/${accountId}/activities`))
      .then(r => cloud.patch(`${test.api}/${accountId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
});

suite.forElement('crm', `accounts/${accountsId}/activities`, { payload: payload }, (test) => {
  test.should.supportNextPagePagination(1);
});
