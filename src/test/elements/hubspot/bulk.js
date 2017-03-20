'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'bulk', (test) => {
  test.should.supportBulkDownload({ qs: { q: 'select * from contacts where firstname = \'Kimberly\'' } });
});
