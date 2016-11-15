'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'lists', (test) => {
  it('should check if the lead is member of the list', () => {
    test.withApi(`${test.api}/1001/leads/42293/isMember`).should.return200OnGet();
  });
});
