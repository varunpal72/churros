'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'accounts', (test) => {
  test.should.return200OnGet();

  it('should allow GET by id', () => {
    return cloud.get(`/hubs/helpdesk/accounts`)
      .then(r => cloud.get(`/hubs/helpdesk/accounts/${r.body[0].id}`));
  });
});
