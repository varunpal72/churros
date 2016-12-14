'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const payload2 = require('./assets/notes');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const build2 = (overrides) => Object.assign({}, payload2, overrides);
const accountsPayload = build({ name: tools.random(), description: tools.random() });
const notesPayload = build2({ Title: tools.random() });
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

  it('should allow CRUDS for accounts/{id}/notes', () => {
    let accountId = -1;
    return cloud.post(test.api, accountsPayload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${accountId}/notes`, notesPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${accountId}/notes`))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
});
