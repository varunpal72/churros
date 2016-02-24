'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', payload, (test) => {

  test.should.return200OnGet();
  test.should.supportPagination();
  it('should support GET / and GET /{id}', () => {
    return cloud.get(test.api)
      .then(r => {return cloud.get(test.api + '/' + r.body[0].entity_id);
    });
});
});
