'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/opportunities');

const updatePayload = {
    "type": "contract"
};

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  it('should support CRUDS for opportunities', () => {
    let opportunityId;
    return cloud.post(test.api, payload)
      .then(r => opportunityId = r.body.changedEntityId)
      .then(r => cloud.get(`${test.api}/${opportunityId}`))
      .then(r => cloud.put(`${test.api}/${opportunityId}`, updatePayload));
  });
});
