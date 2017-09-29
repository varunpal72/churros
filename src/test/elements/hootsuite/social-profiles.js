'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'social-profiles', (test) => {
  let socialProfilesId;
  it(`should allow GET for ${test.api}`, () => {
    return cloud.get(`${test.api}`)
      .then(r => socialProfilesId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${socialProfilesId}`));
  });
  test.should.supportPagination();
});
