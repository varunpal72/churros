'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'lists', (test) => {
  //test.withApi(test.api + '/${tListId}/leads/${leadId}/isMember').should.return200OnGet();
  it('should create a customer and then CRDS for an attachment', () => {
    let listId = 1001;
    let leadId = 42293;
    return cloud.get(`${test.api}/${listId}/leads/${leadId}/isMember`);
  });
});
