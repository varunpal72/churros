'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'bulk/query', (test) => {
  test.should.supportBulkDownload('helpdesk', { qs: { q: 'select * from contacts' } });
  test.should.supportBulkDownload('helpdesk', { qs: { q: 'select * from incidents' } });
  test.should.supportBulkDownload('helpdesk', { qs: { q: 'select * from organizations' } });
});
