'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/default-scoreboards');
const build = (overrides) => Object.assign({}, payload, overrides);
const scoreboardsPayload = build({Name: "name" + tools.randomInt(),DashboardId: "dash" + tools.randomInt()});

suite.forElement('finance', 'default-scoreboards',{ payload:scoreboardsPayload } , (test) => {
  let name;

  //test.should.supportCruds();
  test.should.supportPagination();
  it('should support GET ${test.api}', () => {
    return cloud.get(test.api)
      .then(r => name = r.body[0].Name);
    });
  test
   .withName(`should support searching ${test.api} by Name`)
   .withOptions({ qs: { where:`Name  ='${name}'`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.Name === `${name}`);
   expect(validValues.length).to.equal(r.body.length);
 }).should.return200OnGet();
  });
