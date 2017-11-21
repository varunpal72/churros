'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const addressPayload = require('./assets/addresses');
const expect = require('chakram').expect;
const addressbookentryPayload = require('./assets/addressbookentry');

suite.forElement('crm', 'addresses', (test) => {
  test.should.supportPagination();
  it('should allow CRUD for /addresses', () => {
    let addressId;
    return cloud.post(`/hubs/crm/addressbook-entries`,addressbookentryPayload)
      .then(r => addressPayload.ParentKey = r.body.id)
      .then(r => cloud.post(test.api, addressPayload))
      .then(r => {
        addressId = r.body.Key;
        expect(r.body.City === addressPayload.City).to.not.be.empty;
      })
      .then(r => cloud.withOptions({ qs: { where: "CompanyName='CompanyName ABC'" } }).get(test.api))
      .then(r => {
        expect(r.body[0].Address.Default === true).to.not.be.empty;
      })
      .then(r => cloud.patch(`${test.api}/${addressId}`, addressPayload))
      .then(r => {
        expect(r.body.Key === addressId).to.not.be.empty;
      })
      .then(r => cloud.delete(`${test.api}/${addressId}`))
      .then(r => cloud.delete(`/hubs/crm/addressbook-entries/${addressPayload.ParentKey}`));
  });
});
