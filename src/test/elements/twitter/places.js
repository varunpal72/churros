'use strict';

const suite = require('core/suite');

suite.forElement('social', 'places', { payload: null }, (test) => {
  let lat = "37.7821120598956";
  let longitude = "-122.400612831116";
  let placeId = "df51dec6f4ee2b2c";
  test.withOptions({ qs: { where: `lat = '${lat}' and long = '${longitude}'` } }).should.return200OnGet();
  test.withApi(test.api + '/' + placeId).should.return200OnGet();
});
