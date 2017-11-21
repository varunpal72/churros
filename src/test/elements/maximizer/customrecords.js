'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const customrecordPayload = require('./assets/customrecords.json');
const expect = require('chakram').expect;

suite.forElement('crm', 'custom-records', (test) => {
  test.should.supportPagination('id');
  it('should allow CRUDS for /custom-records', () => {
    let customrecordId;
    return cloud.get(test.api)
      .then(r => {
        customrecordPayload.ApplicationId = r.body[0].ApplicationId;
      })
      .then(r => cloud.post(test.api, customrecordPayload))
      .then(r => {
        customrecordId = r.body.Key;
        expect(r.body.Name === customrecordPayload.Name).to.not.be.empty;
      })
      .then(r => cloud.withOptions({ qs: { where: "Name='CustomRecordName'" } }).get(test.api))
      .then(r => {
        expect(r.body[0].Name === customrecordPayload.Name).to.not.be.empty;
      })
      .then(r => cloud.get(`${test.api}/${customrecordId}`))
      .then(r => cloud.patch(`${test.api}/${customrecordId}`, customrecordPayload))
      .then(r => {
        expect(r.body.Name === customrecordPayload.Name).to.not.be.empty;
      })
      .then(r => cloud.delete(`${test.api}/${customrecordId}`));
  });
});
