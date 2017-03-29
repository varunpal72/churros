'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');
const contactUpdate = () => ({
  "firstName": "test_1"
});

const options = {
  churros: {
    updatePayload: contactUpdate()
  }
};
suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  it(`should support PUT for contacts`, () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.put(`${test.api}/${contactId}`, contactUpdate()))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
