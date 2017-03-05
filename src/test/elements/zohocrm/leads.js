'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const payload2 = require('./assets/notes');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const build2 = (overrides) => Object.assign({}, payload2, overrides);
const leadsPayload = build({ firstName: tools.random(), lastName: tools.random() });
const notesPayload = build2({ Title: tools.random() });

suite.forElement('crm', 'leads', { payload: leadsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "firstName": tools.random(),
        "lastName": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('firstName');

  it('should allow CRUDS for leads/{id}/notes', () => {
    let leadId = -1;
    return cloud.post(test.api, leadsPayload)
      .then(r => leadId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${leadId}/notes`, notesPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${leadId}/notes`))
      .then(r => cloud.delete(`${test.api}/${leadId}`));
  });
});
