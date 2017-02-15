'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ email: tools.randomEmail() });

suite.forElement('marketing', 'contacts', { payload: contactsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "email": tools.randomEmail()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');

  it('should allow GET for contacts/:id/activities,contacts/:id/activities/:id,contacts/:id/campaigns and contacts/:id/lists', () => {
    let contactId;
    return cloud.get(test.api)
      .then(r => contactId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.get('/hubs/marketing/activities'))
      .then(r => cloud.get(`${test.api}/${ r.body.filter(i => i.campaign.name === 'test camp update')[0].prospect_id }/activities/${r.body.filter(i => i.campaign.name === 'test camp update')[0].id}`))
      .then(r => cloud.get(`${test.api}/${contactId}/campaigns`))
      .then(r => cloud.get(`${test.api}/${contactId}/lists`));
  });
});
