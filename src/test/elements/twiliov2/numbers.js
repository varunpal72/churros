'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/messages');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('messaging', 'numbers', {payload: payload}, (test) => {
  it('should allow Read', () => {
    let query = { countryCode: 'US', type: 'Local' };
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers')
    .then(r => expect(r).to.have.statusCode(200));
  });
  it('should allow POST', () => {
    let payload = {"AreaCode":"510"};
    return cloud.post('/hubs/messaging/numbers',payload)
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should allow query by countryCode', () => {
    let query = { countryCode: 'US', type: 'Local'};
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers')
    .then(r => expect(r.body[0].iso_country).to.eq('US'));
  });

  it('should allow query by MmsEnabled', () => {
    let query = { countryCode: 'US', type: 'Local', where: "MmsEnabled='true'"};
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers')
    .then(r => expect(r.body[0].capabilities.MMS).to.eq(true));
  });

  it('should allow query by SmsEnabled', () => {
    let query = { countryCode: 'US', type: 'Local', where: "SmsEnabled='true'"};
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers')
    .then(r => expect(r.body[0].capabilities.SMS).to.eq(true));
  });

  it('should allow Pagination', () => {
    let query = { countryCode: 'US', type: 'Local', page: 1, pageSize: 2 };
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers')
    .then(r => expect(r.body.length).to.eq(2));
  });
});
