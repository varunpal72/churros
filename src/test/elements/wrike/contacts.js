'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'contacts', (test) => {
  test.should.return200OnGet();

  it('should allow GET by current user and GET by ID', () => {
    let query = { "Current User": true };
    return cloud.withOptions({ qs: query }).get('/hubs/helpdesk/contacts')
      .then(r => cloud.get(`${test.api}/${r.body[0].id}`));
  });
});
