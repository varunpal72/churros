'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'users', (test) => {
  let id;
  it(`should allow SR for ${test.api}`, () => {
    return cloud.get(`${test.api}`)
      .then(r => id = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${id}`));
  });
  test.should.supportPagination();
});
