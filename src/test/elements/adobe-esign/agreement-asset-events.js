'use strict';

const suite = require('core/suite');
const payload = require('./assets/groups');
const chakram = require('chakram');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = chakram.expect;

suite.forElement('esignature', 'agreement-asset-events', null, (test) => {
  let date = new Date();
  let startIndex = 0;
  let endIndex = 19;
  let currentDate = date.toISOString().substring(startIndex, endIndex);
  let startDate = date.setDate(date.getDate() - 10);
  let oldDate = new Date(startDate);
  startDate = oldDate.toISOString().substring(startIndex, endIndex);

  it(`should allow GET for ${test.api}`, () => {
    return cloud.withOptions({
      qs: {
        where: `startDate = '${startDate}' and endDate = '${currentDate}'`
      }
    }).get(test.api);
  });
});