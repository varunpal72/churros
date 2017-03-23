'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'bulk', (test) => {
  const opts = {json: true, csv: true};
  test.should.supportBulkDownload({ qs: { q: 'select * from contacts where firstname = \'Kimberly\'' } }, opts, 'contacts');
});
