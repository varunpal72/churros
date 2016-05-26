'use strict';

const suite = require('core/suite');
const payload = require('./assets/track');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'shipments', { payload: payload }, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-06-18 14:12:29\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-06-18 14:12:29\'', pageSize: 5, page: 1 } }).should.return200OnGet();
  it('should support CD of shipments/{id}/track', () => {
    let shipmentsId = -1;
    let trackingId = -1;
    return cloud.get(`/hubs/ecommerce/shipments`)
      .then(r => shipmentsId = r.body[0].id)
      .then(r => cloud.post(`${test.api}/${shipmentsId}/track`, payload))
      .then(r => trackingId = r.body.result)
      .then(r => cloud.delete(`${test.api}/${shipmentsId}/track/${trackingId}`));
  });
});
