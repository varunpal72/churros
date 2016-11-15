'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'places', null, (test) => {
  test.withOptions({ qs: { where: `lat = '37.7821120598956' and long = '-122.400612831116'` } }).should.return200OnGet();
  it('should support Sr on /hubs/social/places', () => {
    let placeId;
    return cloud.withOptions({ qs: { where: `lat = '37.7821120598956' and long = '-122.400612831116'`, page: 1, pageSize: 1 } }).get(test.api)
      .then(r => placeId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${placeId}`));
  });
});
