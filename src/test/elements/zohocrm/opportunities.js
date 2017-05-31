'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const opportunitiesPayload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);
const notesPayload = tools.requirePayload(`${__dirname}/assets/notes.json`);

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
