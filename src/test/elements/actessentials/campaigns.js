'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const cloud = require('core/cloud');

suite.forElement('marketing', 'campaigns', {payload: payload}, (test) => {
  test.should.supportPagination();
  test.should.supportCrs();
  // get /campaigns
  // test.should.ret  urn200OnGet();
  // post campaigns
  // test.should.return200OnPost();

  // it('should RETRIEVE for /campaigns/{id}', () => {
  //   let campaignId = null;
  //   return cloud.get(test.api)
  //   .then(r => campaignId = r.body[0].campaignId)
  //   .then(r => cloud.get(`${test.api}/${campaignId}`));
  // });

});
