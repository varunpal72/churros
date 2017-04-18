'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const options = { payload: payload };
const cloud = require('core/cloud');

suite.forElement('crm', 'contacts', options, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('lastName');
  it('should allow CRUDS for /hubs/crm/contacts/{contactId}/activities', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(console.log(contactId))
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
