'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'bulk', (test) => {
  const opts = {json: true, csv: true};
  test.should.supportBulkDownload({ qs: { q: 'select * from contacts where firstname = \'Kimberly\'' } }, opts, 'contacts');
  test.should.supportBulkUpload(opts, `${__dirname}/assets/contacts.csv`, 'contacts', `email='test123@churros.com'`);
});
