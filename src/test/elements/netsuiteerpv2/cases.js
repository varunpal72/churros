'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/cases');

suite.forElement('erp', 'cases', { payload: payload }, (test) => {
  	test.should.supportCruds();
	test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();
  	test.should.supportCeqlSearch('id');

        it('should allow GET /hubs/erp/cases/:id/messages ', () => {
        let caseId,messageId;
        return cloud.get(test.api)
          .then(r => caseId = r.body[0].id)
          .then(r => cloud.get(`${test.api}/${caseId}/messages`))
          .then(r => messageId = r.body[0].internalId)
          .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 5}}).get(`${test.api}/${caseId}/messages`))
          .then(r => cloud.withOptions({ qs: { where: `internalId ='${messageId}'`}}).get(`${test.api}/${caseId}/messages`));
        });
});
