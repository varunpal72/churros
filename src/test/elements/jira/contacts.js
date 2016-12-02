'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contact');

suite.forElement('helpdesk', 'contacts', {payload:payload}, (test) => {
  let contactId;
  it('should allow CRUDS for /contacts', () => {
  return cloud.post('/hubs/helpdesk/contacts', payload)
    .then(r => contactId = r.body.key)
    .then(r =>  cloud.get('/hubs/helpdesk/contacts/' + contactId))
    .then(r =>  cloud.withOptions({qs:{where:`username='test'`}}).get('/hubs/helpdesk/contacts'))
    .then(r => cloud.withOptions({qs:{where:`username='test'`, page: 1, pageSize: 1 }}).get('/hubs/helpdesk/contacts'))
    .then(r => cloud.delete('/hubs/helpdesk/contacts/' + contactId));
  });
});
