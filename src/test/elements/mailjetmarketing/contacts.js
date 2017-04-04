'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/contacts');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ Email: tools.randomEmail(), foo: tools.random(), Name: tools.random() });

suite.forElement('marketing', 'contacts', { payload: contactsPayload }, (test) => {
  test.should.supportPagination();
  test.withOptions({ qs: { page: 1, pageSize: 1, where: `LastUpdateAt ='2017-01-19'` } }).should.return200OnGet();
  it(`should support CRUS for ${test.api}`, () => {
    let updatePayload = {
      "Name": tools.random()
    };
    let contactID;
    return cloud.post(test.api, contactsPayload)
      .then(r => contactID = r.body.ID)
      .then(r => cloud.get(`${test.api}/${contactID}`))
      .then(r => cloud.patch(`${test.api}/${contactID}`, updatePayload));
  });
});