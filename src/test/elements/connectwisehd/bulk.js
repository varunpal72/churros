'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'bulk/query', (test) => {
  const opts = {json: true};
  test.should.supportBulkDownload({ qs: { q: 'select * from contacts where city = \'Tampa\'' } }, opts, 'contacts');
  test.should.supportBulkDownload({ qs: { q: 'select * from incidents' } }, opts, 'incidents');
  test.should.supportBulkDownload({ qs: { q: 'select * from organizations' } }, opts, 'organizations');
});
