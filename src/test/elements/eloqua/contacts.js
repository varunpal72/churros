'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/contacts');

suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
  const opts = {
    churros: {
      updatePayload: {
        firstName: tools.random(),
        lastName : tools.random(),
        emailAddress: tools.randomEmail()
      }
    }
  };
  test.withOptions(opts).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');

  it('should allow GET hubs/marketing/contacts/{contactId}/activities', () => {
    let contactId;
    return cloud.get(test.api)
      .then(r => contactId = r.body[0].id)   
      .then(r => cloud.withOptions({ qs: { where: `startAt='1417556990' AND endAt='1447567663' AND type='emailOpen'` } }).get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.withOptions({ qs: { where: `startAt='1417556990' AND endAt='1447567663' AND type='emailOpen'`, page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/activities`));
  });
});
