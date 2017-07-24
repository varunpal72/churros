'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/lists.json`);

suite.forElement('general', 'lists', { payload: payload }, (test) => {

  it('should allow CRUD for hubs/general/lists', () => {
    let listId;
    let updateList = {
      "name": "Barclays Premiere League"
    };
    return cloud.post(`${test.api}`, payload)
      .then(r => listId = r.body.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${listId}`))
      .then(r => cloud.put(`${test.api}/${listId}`, updateList))
      .then(r => cloud.delete(`${test.api}/${listId}`));
  });
  test.should.supportPagination();
  test.should.supportCeqlSearch('name');
});
