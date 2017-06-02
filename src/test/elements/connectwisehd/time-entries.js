'use strict';

const suite = require('core/suite');
const payload = require('./assets/time-entries');

suite.forElement('helpdesk', 'time-entries', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { where: `lastModifiedDate>='2014-01-15T00:00:00.000Z'` } }).should.return200OnGet();
  test.should.supportPagination();
});
