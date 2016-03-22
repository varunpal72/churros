'use strict';

const suite = require('core/suite');
const payload = require('./assets/groups');
const chakram = require('chakram');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = chakram.expect;
const util = require('util');

suite.forElement('esignature', 'agreementAssetEvents', null, (test) => {
  var date = new Date();
  let startIndex = 0;
  let endIndex = 19;
  let currentDate = date.toISOString().substring(startIndex,endIndex);
  startDate = date.setDate(date.getDate()-10);
  var oldDate = new Date(startDate);
  var startDate = oldDate.toISOString().substring(startIndex,endIndex);

  it('should allow GET for ' + test.api, () => {
    return cloud.withOptions({
      qs: {
        where: util.format("startDate='"+startDate+"' and endDate='"+currentDate+"'")
      }
    }).get(test.api);
  });
});
