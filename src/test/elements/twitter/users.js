'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'users', null, (test) => {
  test.withOptions({ qs: { where: 'q = \'charuhas\'', page: 1, pageSize: 1 } }).should.return200OnGet();
  it('should get an user ', () => {
    return cloud.get(`${test.api}/140688569`);
  });
});
