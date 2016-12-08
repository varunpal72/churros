'use strict';

const suite = require('core/suite');
const payload = require('./assets/journal-entries');

suite.forElement('finance', 'journal-entries', { payload: payload, skip: false}, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
