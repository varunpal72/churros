'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const customrecordPayload = require('./assets/customrecords.json');

suite.forElement('crm', 'custom-records', (test) => {
  test.should.supportPagination('id');
  let applicationId, customrecordId;
  it('should allow CRUDS for /custom-records', () => {
    return cloud.get(`${test.api}`)
      .then(r => applicationId = r.body[0].ApplicationId)
      .then(r => customrecordPayload.ApplicationId = applicationId)
      .then(r => cloud.post(`${test.api}`, customrecordPayload))
      .then(r => customrecordId = r.body.Key)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${customrecordId}`))
      .then(r => cloud.patch(`${test.api}/${customrecordId}`, customrecordPayload))
      .then(r => cloud.delete(`${test.api}/${customrecordId}`));
  });
});
