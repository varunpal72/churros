'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'meetings', null, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  //test.should.supportPagination();
  test.should.supportSr();
  it('it should support POST a contact inside a list', () => {
    return cloud.get(`${test.api}?pageSize=5&page=1`);
//    .then(r => id = r.body.id)
//    .then(r => cloud.get(`${test.api}?pageSize=5&page=1`));
  });
});
