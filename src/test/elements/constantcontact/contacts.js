'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const listspayload = require('./assets/lists');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = require('chakram').expect;
const build = (overrides) => Object.assign({}, payload, overrides);
const contactPayload = build({ first_name: tools.random() });
const build1 = (overrides) => Object.assign({}, listspayload, overrides);
const listayload = build1({ name:tools.random() });
suite.forElement('marketing', 'contacts', { payload: contactPayload }, (test) => {
contactPayload.email_addresses[0].email_address = tools.randomEmail();
  const options = {
    churros: {
      updatePayload: {
        "first_name": tools.random(),
     "email_addresses": [
        {
            "email_address":contactPayload.email_addresses[0].email_address
        }
    ]
      }
    }
  };

var id;
 before(() => {
    cloud.post(`/hubs/marketing/lists`,listayload)
      .then(r=> id=r.body.id)
       .then(r=>contactPayload.lists[0].id=id);});

  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(1);
  test.withName(`should support searching ${test.api} by contact status`)
    .withOptions({ qs: { where: `status ='ACTIVE'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.status = 'ACTIVE');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
after(() => {
    cloud.delete(`/hubs/marketing/lists/${id}`);
});
});
