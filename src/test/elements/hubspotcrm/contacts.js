'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const cloud = require('core/cloud');
suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  //test.should.supportCruds();
  //test.should.supportPagination();
  const build = (overrides) => Object.assign({}, payload, overrides);
  const contactsPayload = build({ lastName: tools.random(), firstName: tools.random() });
  it('should get all the activities of the contact', () => {
    let contactId;
    return cloud.get(`${test.api}/396139/activities`);
    //cloud.post(test.api, contactsPayload)
    //  .then(r => contactId = r.body.vid)
    //  .then(r => cloud.get(`${test.api}/${contactId}/activities`));
  });
});
