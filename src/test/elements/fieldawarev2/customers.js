'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const tools = require('core/tools');
const cloud = require('core/cloud');
const contactspayload = require('./assets/contacts');
const locationspayload = require('./assets/locations');

suite.forElement('fsa', 'customers', { payload: payload }, (test) => {

  payload.name = tools.random();
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('name');

  it('should allow CRUDS for /customer/:id/contacts', () => {

    const updatedCPayload = contactspayload;
    updatedCPayload.firstName = tools.random();
    let customerId, contactId;
    return cloud.post(`/hubs/fsa/customers`, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.post(`/hubs/fsa/customers/${customerId}/contacts`, contactspayload))
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`/hubs/fsa/customers/${customerId}/contacts`))
      .then(r => cloud.get(`/hubs/fsa/customers/${customerId}/contacts/${contactId}`))
      .then(r => cloud.patch(`/hubs/fsa/customers/${customerId}/contacts/${contactId}`, updatedCPayload))
      .then(r => cloud.delete(`/hubs/fsa/customers/${customerId}/contacts/${contactId}`))
      .then(r => cloud.delete(`/hubs/fsa/customers/${customerId}`));
  });
  it('should allow CRUDS for /customer/:id/locations', () => {

    const updatedLPayload = locationspayload;
    updatedLPayload.name = tools.random();
    let customerId, locationId;
    return cloud.post(`/hubs/fsa/customers`, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.post(`/hubs/fsa/customers/${customerId}/location`, locationspayload))
      .then(r => locationId = r.body.id)
      .then(r => cloud.get(`/hubs/fsa/customers/${customerId}/locations`))
      .then(r => cloud.get(`/hubs/fsa/customers/${customerId}/locations/${locationId}`))
      .then(r => cloud.patch(`/hubs/fsa/customers/${customerId}/location/${locationId}`, updatedLPayload))
      .then(r => cloud.delete(`/hubs/fsa/customers/${customerId}/locations/${locationId}`))
      .then(r => cloud.delete(`/hubs/fsa/customers/${customerId}`));
  });
});
