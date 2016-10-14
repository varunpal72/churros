'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/field');

suite.forElement('helpdesk', 'fields', {skip: true, payload:payload}, (test) => {
  it('should allow create and get of fields', () => {
    cloud.post("/hubs/helpdesk/fields", payload)
    .then(cloud.get("/hubs/helpdesk/fields"));
  });
});
