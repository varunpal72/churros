'use strict';

const suite = require('core/suite');
const payload = require('./assets/companies');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const companiesPayload = build({ company:tools.randomStr(),annualRevenue:tools.randomInt(),billingCity : tools.randomStr(),billingCountry: tools.randomStr(),externalCompanyId:tools.randomInt(),billingPostalCode:tools.randomInt(),billingState:tools.randomStr(),companyNotes:tools.randomStr(),industry :tools.randomStr(),mainPhone:tools.randomInt});

const updatedPayload  = {
   "company" :tools.randomStr(), 
   "billingCity": tools.randomStr(),
   "billingCountry" :tools.randomStr(),
   "billingPostalCode" : tools.randomInt(),
   "billingState" : tools.randomStr(),
   "companyNotes" :tools.randomStr(),
   "industry": tools.randomStr(),
   "mainPhone": tools.randomInt()
};
suite.forElement('marketing', 'companies', { payload: companiesPayload}, (test) => {
 it('should allow CRUDS for /companies', () => {
   let id,value;
   return cloud.post(test.api,companiesPayload)
	  .then(r => id =r.body.id)
	  .then(r => value=`id in ( ${id} )`)
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.patch(`${test.api}/${id}`,updatedPayload))
          .then(r => cloud.withOptions({ qs: {where : `${value}`}}).get(`${test.api}`))
 	  .then(r => cloud.delete(`${test.api}/${id}`));
});
});

