'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('social', 'companies', (test) => {
  let companyId;
  let startTimestamp = Math.floor(Date.now()) - 1000000;
  let endTimestamp = Math.floor(Date.now());

  test.should.return200OnGet();
  test.should.supportPagination();

  it(`should allow to get followers-count for ${test.api}/{id}/followers`, () => {
    return cloud.get('/hubs/social/companies')
      .then(r => companyId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${companyId}/followers`));
  });

  it(`should allow GET ${test.api}/{id}/followers-statistics`, () => {
    return cloud.withOptions({ qs: { 'start-timestamp': `${startTimestamp}`, 'end-timestamp': `${endTimestamp}`, 'time-granularity': 'month' } }).get(`${test.api}/${companyId}/followers-statistics`);
  });

  it(`should allow paginating with page and pageSize for ${test.api}/{id}/followers-statistics`, () => {
    return cloud.withOptions({ qs: { 'start-timestamp': `${startTimestamp}`, 'time-granularity': 'month', page: 1, pageSize: 3 } }).get(`${test.api}/${companyId}/followers-statistics`)
      .then(r => expect(r.body.length).to.be.below(4))
      .then(r => cloud.withOptions({ qs: { 'start-timestamp': `${startTimestamp}`, 'time-granularity': 'month', page: 1, pageSize: 3 } }).get(`${test.api}/${companyId}/followers-statistics`))
      .then(r => expect(r.body.length).to.be.below(3));
  });

  it(`should allow GET ${test.api}/{id}/is-administrator`, () => {
    return cloud.get(`${test.api}/${companyId}/is-administrator`);
  });

  it(`should allow GET ${test.api}/{id}/is-company-share-enabled`, () => {
    return cloud.get(`${test.api}/${companyId}/is-company-share-enabled`);
  });

  it(`should allow GET ${test.api}/{id}/profile`, () => {
    return cloud.get(`${test.api}/${companyId}/profile`);
  });

  it(`should allow GET ${test.api}/{id}/profile-details`, () => {
    return cloud.get(`${test.api}/${companyId}/profile-details`);
  });

  it(`should allow GET ${test.api}/{id}/statistics`, () => {
    return cloud.get(`${test.api}/${companyId}/statistics`);
  });

  it(`should allow GET ${test.api}/{id}/status-statistics`, () => {
    return cloud.withOptions({ qs: { 'start-timestamp': `${startTimestamp}`, 'end-timestamp': `${endTimestamp}`, 'time-granularity': 'month' } }).get(`${test.api}/${companyId}/status-statistics`);
  });

  it(`should allow paginating with page and pageSize for ${test.api}/{id}/status-statistics`, () => {
    return cloud.withOptions({ qs: { 'start-timestamp': `${startTimestamp}`, 'time-granularity': 'month', page: 1, pageSize: 3 } }).get(`${test.api}/${companyId}/status-statistics`)
      .then(r => expect(r.body.length).to.be.below(4))
      .then(r => cloud.withOptions({ qs: { 'start-timestamp': `${startTimestamp}`, 'time-granularity': 'month', page: 1, pageSize: 3 } }).get(`${test.api}/${companyId}/status-statistics`))
      .then(r => expect(r.body.length).to.be.below(3));
  });
});
