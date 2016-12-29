'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');

suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');

  it('should allow GET for contacts/:id/activities,contacts/:id/campaigns and contacts/:id/lists', () => {
    let contactId = -1;
    return cloud.get(test.api)
      .then(r => contactId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.get(`${test.api}/${contactId}/campaigns`))
      .then(r => cloud.get(`${test.api}/${contactId}/lists`));
  });
});
