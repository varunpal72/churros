'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

suite.forElement('general', 'contacts', { payload: payload }, (test) => {
  let contactId;
  it('should test CRUD of  contacts', () => {
  return cloud.post(test.api, payload)
   .then(r => {
	       contactId=r.body.id;
	       payload.etag = r.body.etag;
              })
   .then(r => cloud.patch(`${test.api}/${contactId}`, payload))
   .then(r => cloud.get(`${test.api}/${contactId}`))
   .then(r => cloud.withOptions({ qs: { id: 'me' } }).get(`/hubs/general/contacts-batch`))
   .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
