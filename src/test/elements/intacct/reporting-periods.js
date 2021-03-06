'use strict';

const suite = require('core/suite');
const schema = require('./assets/schema.json');

suite.forElement('finance', 'reporting-periods', null , (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.withValidation(schema).withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'RECORDNO=\'111\'' } }).should.return200OnGet();
});
