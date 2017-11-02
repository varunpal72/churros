'use strict';

const suite = require('core/suite');
const companyPayload = require('./assets/company');

suite.forElement('crm', 'companies', {payload: companyPayload}, (test) => {
 test.should.supportPagination();
 test.should.supportCruds();
});
