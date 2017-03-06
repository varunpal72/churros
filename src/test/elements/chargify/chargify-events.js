'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('payment', 'chargify-events', (test) => {
  test.withOptions({
    qs: {
      page: 1,
      pageSize: 5,
      where: `subscription_id='13023381'`
    }
  }).should.supportPagination();
  test.withOptions({ qs: { where: 'direction=\'desc\''}}).should.return200OnGet();
});
