'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');

const contact = () =>({
    "last_name": "Fallon",
    "display_name": "Jimmy Fallon",
    "job_title": "Late Night Host",
    "first_name": "Jimmy",
    "email": "Jfallon@nbc.com"
});

suite.forElement('crm', 'contacts', payload, (test) => {
  return cloud.post(test.api, contact())
    .then(r => contactId = r.body.id)
    .then(r => cloud.get(test.api + '/' + contactId))
    .then(r => cloud.get(test.api + '/search/', 'email=test'))
    .then(r => cloud.get(test.api + '/changes'))
    .then(r => cloud.get(test.api + '/fields'))
    .then(r => cloud.get(test.api + '/filters'))
    .then(r => cloud.delete(test.api + '/' + contactId));
});

// Patch