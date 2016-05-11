'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/messages');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('messaging', 'numbers', {payload: payload}, (test) => {
  it('should allow Read', () => {
    let query = { countryCode: 'US', type: 'Local' };
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers');
  });

  it('should allow query by countryCode', () => {
    var query = { countryCode: 'US', type: 'Local'};
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers');
    .then(r => expect(r.body[0].iso_country).to.eq('US'));
  });

  it('should allow query by MmsEnabled', () => {
    var query = { countryCode: 'US', type: 'Local', where: "MmsEnabled='true'"};
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers');
    .then(r => expect(r.body[0].capabilities.MMS).to.eq(true));
  });

  it('should allow query by SmsEnabled', () => {
    var query = { countryCode: 'US', type: 'Local', where: "SmsEnabled='true'"};
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers');
    .then(r => expect(r.body[0].capabilities.SMS).to.eq(true));
  });

  it('should allow Pagination', () => {
    var query = { countryCode: 'US', type: 'Local', page: 1, pageSize: 2 };
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/numbers');
    .then(r => expect(r.body.length).to.eq(2));
  });
});
