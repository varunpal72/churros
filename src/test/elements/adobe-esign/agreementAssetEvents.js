'use strict';

const suite = require('core/suite');
const payload = require('./assets/groups');
const chakram = require('chakram');
const cloud = require('core/cloud');
//const winston = require('winston');
const tools = require('core/tools');
const expect = chakram.expect;
const util = require('util');

suite.forElement('esignature', 'agreementAssetEvents',null, (test) => {
  it('should allow GET for '+test.api, () => {
	return cloud.withOptions({ qs: { where: util.format("startDate='2016-03-01T13:21:00' and endDate='2016-03-01T13:22:00'") }}).get(test.api);
  });  
});
