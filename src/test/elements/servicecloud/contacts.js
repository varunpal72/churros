'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const updatePayload = {
  "login": tools.random()
};
suite.forElement('helpdesk', 'contacts',{payload : payload}, (test) => {
  it('should allow CRUDS for contacts', () => {
    let contactID;
    return cloud.get(test.api)
      .then(r => cloud.post(test.api, payload))
      .then(r => contactID = r.body.id.id)
      .then(r => cloud.get(`${test.api}/${contactID}`))
      .then(r => cloud.patch(`${test.api}/${contactID}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${contactID}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `login='Admin1'` } }).get(test.api));
  });
});
