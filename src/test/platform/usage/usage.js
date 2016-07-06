'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const moment = require('moment');
const usageSchema = require('./assets/usage.schema');
const analyticsSchema = require('./assets/analytics.schema');

suite.forPlatform('usage', { schema: usageSchema }, (test) => {
  let yesterday, today, trafficId;
  before(done => {
    today = moment().format('YYYY[-]MM[-]DD');
    yesterday = moment().subtract(1, 'days').format('YYYY[-]MM[-]DD');
    done();
  });

  it('should support usage search', () => {
    return cloud.get('usage', usageSchema)
      .then(r => trafficId = r.body[0].traffic_id)
      .then(r => cloud.withOptions({ qs: {from: yesterday, to: today, hub: 'crm', 'keys[]': 'sfdc', 'tags[]': 'sfdc', status: 'success', searchText: 'AccountId'}}).get('usage', usageSchema));
  });
  it('should support usage by ID', () => cloud.get(`usage/${trafficId}`));
  it('should support offset pagination', () => {
    return cloud.withOptions({ qs: { pageSize: 1 } }).get('usage', usageSchema)
      .then(r => cloud.withOptions({ qs: { pageSize: 1, pageOffset: 1 } }).get('usage', usageSchema));
  });
  it('should support token pagination', () => {
    return cloud.withOptions({ qs: { pageSize: 1 } }).get('usage', usageSchema)
      .then(r => cloud.withOptions({ qs: { nextPage: r.response.headers[ 'elements-next-page-token' ] } }).get('usage'), usageSchema);
  });
  it('should support response time analytics', () => cloud.withOptions({ qs: { from: yesterday, to: today } }).get('usage/analytics/times', analyticsSchema));
  it('should support status analytics', () => cloud.withOptions({ qs: { from: yesterday, to: today } }).get('usage/analytics/statuses', analyticsSchema));
});
