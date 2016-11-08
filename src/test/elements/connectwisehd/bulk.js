'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'bulk/query', (test) => {
  test.withOptions({ qs: { q: 'select * from contacts' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select * from incidents' } }).should.return200OnPost();
  test.withOptions({ qs: { q: 'select * from organizations' } }).should.return200OnPost();
});
