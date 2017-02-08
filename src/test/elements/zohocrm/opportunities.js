'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');
const payload2 = require('./assets/notes');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const build2 = (overrides) => Object.assign({}, payload2, overrides);
const opportunitiesPayload = build({ name: tools.random(), description: tools.random() });
const notesPayload = build2({ Title: tools.random() });

suite.forElement('crm', 'opportunities', { payload: opportunitiesPayload }, (test) => {
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
  test.should.supportCeqlSearchForMultipleRecords('name');

  it('should allow CRUDS for leads/{id}/notes', () => {
    let opportunityId = -1;
    return cloud.post(test.api, opportunitiesPayload)
      .then(r => opportunityId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${opportunityId}/notes`, notesPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${opportunityId}/notes`))
      .then(r => cloud.delete(`${test.api}/${opportunityId}`));
  });
});
