'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const opportunityPayload = require('./assets/opportunities');
const addressbookentryPayload = require('./assets/addressbookentry');
const expect = require('chakram').expect;

suite.forElement('crm', 'opportunities', (test) => {
  test.should.supportPagination('id');
  it('should allow CRUDS for /contacts', () => {
    let opportunityId;
    return cloud.post(`/hubs/crm/addressbook-entries`,addressbookentryPayload)
      .then(r => opportunityPayload.AbEntryKey = r.body.id)
      .then(r => cloud.post(test.api, opportunityPayload))
      .then(r => {
        opportunityId = r.body.Key;
        expect(r.body.Description === opportunityPayload.Description).to.not.be.empty;
      })
      .then(r => cloud.withOptions({ qs: { where: "Description='opportunity1'" } }).get(test.api))
      .then(r => {
        expect(r.body[0].Description === opportunityPayload.Description).to.not.be.empty;
      })
      .then(r => cloud.get(`${test.api}/${opportunityId}`))
      .then(r => cloud.patch(`${test.api}/${opportunityId}`, opportunityPayload))
      .then(r => {
        expect(r.body.Description === opportunityPayload.Description).to.not.be.empty;
      })
      .then(r => cloud.delete(`${test.api}/${opportunityId}`))
      .then(r => cloud.delete(`/hubs/crm/addressbook-entries/${opportunityPayload.AbEntryKey}`));
  });
});
