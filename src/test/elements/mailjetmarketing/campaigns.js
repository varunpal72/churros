'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/campaigns');

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
	test.should.supportPagination();
	test.should.return200OnGet();

	it('should support PATCH', () => {
		cloud.update(`/hubs/marketing/campaigns/1`, payload, r => expect(r).to.have.statusCode(200));
	});
});
