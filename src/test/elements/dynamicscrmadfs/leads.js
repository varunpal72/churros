'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
 test.should.supportCruds();
 test.should.supportPagination();
});
