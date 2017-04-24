'use strict';

const suite = require('core/suite');
const payload = require('./assets/items');
const tools = require('core/tools');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const itemsPayload = build({ Name: tools.randomEmail(), Level1Code: tools.random() });

suite.forElement('expense', 'items', { payload: itemsPayload }, (test) => {
  it('should support CRUDS for /hubs/expense/items', () => {
    let id, listId;
    return cloud.post(test.api, itemsPayload)
      .then(r => id = r.body.ID)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => listId = r.body.ListID)
      .then(r => cloud.patch(`${test.api}/${id}`, itemsPayload))
      .then(r => cloud.withOptions({ qs: { listId: `${listId}` } }).delete(`${test.api}/${id}`));
  });
  test.should.supportNextPagePagination(2);
  test
    .withName(`should support searching ${test.api} by name`)
    .withOptions({ qs: { where: `name='American Express Travel1'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'American Express Travel1');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
