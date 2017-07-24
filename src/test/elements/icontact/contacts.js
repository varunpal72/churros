'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

suite.forElement('general', 'contacts', { payload: payload }, (test) => {

  it('should allow CRUD for hubs/general/contacts', () => {
    let contactId;
    let updateContact = {
      "email": "alanGardner@hangover.com",
      "firstName": "Alan",
      "lastName": "Gardner"
    };
    return cloud.post(`${test.api}`, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.withOptions({ qs: { status: 'total' } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.put(`${test.api}/${contactId}`, updateContact))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
  test.should.supportPagination();
  test.should.supportCeqlSearch('email');
});
