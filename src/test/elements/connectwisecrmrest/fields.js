
'use strict';

const suite = require('core/suite');
const payload = require('./assets/fields');

suite.forElement('crm', 'fields', { payload: payload }, (test) => {
  it.skip('should allow CRS for /hubs/helpdesk/fiels', () => {
     test.should.supportCrs();
  });
});
