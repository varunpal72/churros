'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const customrecordPayload = () => ({
  "Name": "CustomRecordName"
});

suite.forElement('crm', 'custom-records', (test) => {
  test.should.supportPagination('id');
  let applicationId, customrecordId, req;
  it('should allow CRUDS for /custom-records', () => {
    return cloud.get(`${test.api}`)
      .then(r => applicationId = r.body[0].ApplicationId)
      .then(r => req = customrecordPayload())
      .then(r => req.ApplicationId = applicationId)
      .then(r => cloud.post(`${test.api}`, req))
      .then(r => cloud.get(`${test.api}`))
      .then(r => customrecordId = r.body[0].Key)
      .then(r => cloud.get(`${test.api}/${customrecordId}`))
      .then(r => cloud.patch(`${test.api}/${customrecordId}`, {}))
      .then(r => cloud.delete(`${test.api}/${customrecordId}`));
  });
});
