'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const  payload= require('./assets/jobs');
const build = (overrides) => Object.assign({}, payload, overrides);
const jobsPayload = build({Schedulableid: "sche" + tools.randomInt()});

suite.forElement('finance', 'jobs',{ payload:jobsPayload } , (test) => {
  let name,j, k,i,updatedPayload,id;
  i=(Math.floor(Math.random() * (10 - 1 + 1)) + 1);
    jobsPayload.Name = "name" +i+ tools.randomInt();
    j= i+1;
    k=j+1;
    jobsPayload.CRONExpression= " "+j+" "+i+" "+k+" L * ?";
      test.should.supportCrds();
      it('should support PATCH ${test.api}', () => {
        return cloud.get(test.api)
          .then(r => {id = r.body[0].id;
                      name= "name" + tools.randomInt();
                      updatedPayload = {"Name": name};  } )
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
