'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const notesPayload = tools.requirePayload(`${__dirname}/assets/notes.json`);
const cloud = require('core/cloud');

suite.forElement('crm', 'accounts', { payload: accountsPayload }, (test) => {
  it('should allow ping for zohocrm', () => {
    return cloud.get(`/hubs/crm/ping`);
  });

  const options = {
    churros: {
      updatePayload: {
        "name": tools.random(),
        "description": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('Website');

  it('should allow CRUDS for accounts/{id}/notes', () => {
    let accountId = -1;
    return cloud.post(test.api, accountsPayload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${accountId}/notes`, notesPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${accountId}/notes`))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
});
