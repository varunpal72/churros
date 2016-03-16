'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'banks', null, (test) => {
  it('Should support GET', () => {
    return cloud.get(test.api)
  });
  test.should.supportPagination();
  test.withOptions({qs: {where: 'code=\'1200\''}}).should.return200OnGet();
});
