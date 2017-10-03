'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const defaultScoreboardsPayload = tools.requirePayload(`${__dirname}/assets/default-scoreboards.json`);

suite.forElement('finance', 'default-scoreboards', { payload: defaultScoreboardsPayload, skip: true }, (test) => {
  let number = "0050Y00" + Math.random(10).toPrecision(3).replace("\.", "") + "dB4YQAU";
  defaultScoreboardsPayload.SetupOwnerId = number;
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
