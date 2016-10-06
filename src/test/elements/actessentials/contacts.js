'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const expect = require('chai').expect;

suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  // test for functional where to OData field
  test.withOptions({qs: {where: 'lastName=\'Smith\''} }).should.return200OnGet();
  // check for groupId where clause override
  // it('should allow a groupId in the where clause for GET /contacts', () => {
  //   let groupId = null;
  //   let newGroup = require('./assets/lists');
  //   return cloud.post(`${test.api}/lists`, newGroup)
  //     .then(r => groupId = r.body.id)
  //     .then(r => cloud.withOptions({qs: {where: 'groupId=\''+ groupId + '\''}}).get(`${test.api}/contacts`))
  //     // should get 200 with empty response
  //     .then(r => expect(r.body.length).to.deep.equal([]))
  //     // delete list that was created for test
  //     .then(r => cloud.delete(`${test.api}/lists/${groupId}`));
  // });

});
