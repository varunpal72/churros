'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'users', null, (test) => {
  test.withOptions({ qs: { where: 'q = \'charuhas\'', page: 1, pageSize: 1 } }).should.return200OnGet();
  it('should support Sr on /hubs/social/users', () => {
    let userId;
    return cloud.withOptions({ qs: { where: 'q = \'charuhas\'', page: 1, pageSize: 1 } }).get(test.api)
      .then(r => userId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${userId}`));
  });
});
