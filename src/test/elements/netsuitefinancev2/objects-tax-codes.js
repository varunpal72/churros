'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'objects', (test) => {
  let objectName = "customer";
  it('should support GET /objects-tax-codes', () => {
    return  cloud.get(`${test.api}/${objectName}/tax-codes`)
  });
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
