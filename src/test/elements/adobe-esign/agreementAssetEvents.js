'use strict';

const suite = require('core/suite');
const payload = require('./assets/groups');
const chakram = require('chakram');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = chakram.expect;
const util = require('util');

suite.forElement('esignature', 'agreementAssetEvents', null, (test) => {
  let currentDate;	
  var date = new Date();
  currentDate = date.toISOString().substring(0,19); 
  it('should allow GET for ' + test.api, () => {
    return cloud.withOptions({
      qs: {
        where: util.format("startDate='2016-01-01T00:00:00' and endDate='"+currentDate+"'")
      }
    }).get(test.api);
  });
});
