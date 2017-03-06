'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/contact');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ name: tools.random(),email: tools.randomEmail(),displayName:tools.random()});

suite.forElement('helpdesk', 'contacts', {payload:contactsPayload}, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    let contactId;
    return cloud.post(test.api, contactsPayload)
      .then(r => contactId = r.body.key)
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.withOptions({ qs: { where:`username='test'`}}).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `username='test'`, page: 1, pageSize: 1 }}).get(test.api))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
   });
 });