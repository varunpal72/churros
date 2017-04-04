'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'query', (test) => {
  it('should allow get query', () => {
    test.withOptions({ qs: { q: 'select * from agents' } }).should.return200OnGet();
  });
});
