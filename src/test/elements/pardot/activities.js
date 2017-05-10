'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('marketing', 'activities', (test) => {
  test.should.supportPagination();
  it('should support CEQL search for /hubs/marketing/activites ', () => {
    let id;
    return cloud.get(test.api)
      .then(r => id = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { where: `id='${id}'` } }).get(test.api))
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.id).to.equal.id;
      });
  });
});
