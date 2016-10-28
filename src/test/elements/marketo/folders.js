'use strict';

const tools = require('core/tools');
const suite = require('core/suite');
const payload = require('./assets/folders');
const cloud = require('core/cloud');
const updatePayload = {
  			"name" : "Test Folder Updated",
  			"description" : tools.randomStr()
			}

suite.forElement('marketing', 'folders', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('It should perform C for /folders', () => {
	//test.should.supportCrus();
	let id;
	return cloud.post(test.api, payload)
		.then(r => id = r.body.id)
		.then(r => cloud.patch(`${test.api}/${id}`, updatePayload))
		.then(r => cloud.get(test.api))
		.then(r => cloud.get(`${test.api}/${id}`));
  });

});
