'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/importers');
const build = (overrides) => Object.assign({}, payload, overrides);
const importersPayload = build({ Name: "name" + tools.randomInt()});

suite.forElement('finance', 'importers',{ payload:importersPayload } , (test) => {
  let name,updatedPayload,id;
  it('should support GET Jobs', () => {
    return cloud.get(`/hubs/finance/jobs`)
      .then(r => importersPayload.Job = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/dimensions`))
      .then(r => importersPayload.Dimension = r.body[0].id);
    });
    test.should.supportCrds();
    it('should support PATCH ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = {"Name": "ce"};  } )
        .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
      });
    test.should.supportPagination();
    test
     .withName(`should support searching ${test.api} by Name`)
     .withOptions({ qs: { where:`Name  ='${name}'`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.Name === `${name}`);
     expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  });
