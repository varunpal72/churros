'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const updatePayload = build({ "name": "test" + tools.random() });

suite.forElement('social', 'lists', { payload: payload }, (test) => {
  test.should.supportPagination();
  it('should support CRUDS for /hubs/social/lists/{id}/subscribers', () => {
    let listId;
    return cloud.post(test.api, payload)
      .then(r => listId = r.body.id_str)
      .then(r => cloud.put(`${test.api}/${listId}`, updatePayload))
      .then(r => cloud.get(`${test.api}/${listId}`))
      .then(r => cloud.delete(`${test.api}/${listId}`));
  });
});
