'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;


suite.forElement('finance', 'bills-payments', null, (test) => {
  it(`should allow RS for ${test.api}`, () => {
    let recordNo;
    return cloud.get(test.api)
      .then(r => recordNo = r.body[0].RECORDNO)
      .then(cloud.get(test.api + "/${recordNo}"))
      .then(cloud.withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } })
        .get(test.api)
        .then((r) => {
          expect(r).to.have.statusCode(200);
          const validValues = r.body.filter(obj =>
            obj.whenmodified >= '08/13/2016 05:26:37');
          expect(validValues.length).to.equal(r.body.length);
        }));
  });
});
