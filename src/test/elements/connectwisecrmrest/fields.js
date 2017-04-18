
'use strict';

const suite = require('core/suite');
const payload = require('./assets/fields');
const cloud = require('core/cloud');

suite.forElement('crm', 'fields/{type}', { payload: payload }, (test) => {
  it.skip('should allow CRS for /hubs/helpdesk/fiels/{type}', () => {
    let fieldId;
    return cloud.post(test.api, payload)
      .then(r => fieldId = r.body.id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${fieldId}`));
  });
});
