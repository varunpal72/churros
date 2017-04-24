
'use strict';

const suite = require('core/suite');
const payload = require('./assets/fields');

suite.forElement('crm', 'fields', { payload: payload, skip: true }, (test) => {
  test.should.supportCrs();
});
