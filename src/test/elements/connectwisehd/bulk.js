'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'bulk/query', (test) => {
  // console.log(test.should.supportBulkDownload('helpdesk', { qs: { q: 'select * from contacts' } }))
  test.withOptions({ qs: { q: 'select * from contacts' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select * from incidents' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select * from organizations' } }).should.return200OnPost();
});
