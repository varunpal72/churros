'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'users', { payload: null }, (test) => {
  test.withOptions({ qs: { where: 'q = \'charuhas\'', page: 1, pageSize: 1 } }).should.return200OnGet();
  it('should get an user ', () => {
    let userId = "140688569";
    return cloud.get(`${test.api}/${userId}`);
  });
});
