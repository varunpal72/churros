'use strict';

const suite = require('core/suite');
const addressbookentryPayload = require('./assets/addressbookentry');

suite.forElement('crm', 'addressbook-entries', {payload: addressbookentryPayload}, (test) => {
 test.should.supportPagination();
 test.should.supportCruds();
});
