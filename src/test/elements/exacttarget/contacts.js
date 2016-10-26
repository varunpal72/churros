'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ contactKey:tools.randomEmail()});
var key,value;
var name =tools.random();
var emailValue =tools.randomEmail();
var contactKey = contactsPayload.contactKey;
const updatedPayload  = {
   "contactKey":contactKey,
   "attributeSets":[
      {
         "name":"Email Addresses",
         "items":[
            {
               "values":[
                  {
                     "name":"Email Address",
                     "value":emailValue
                  },
                  {
                     "name":"HTML Enabled",
                     "value":true
                  }
               ]
            }
         ]
      }
   ]
}
suite.forElement('marketing', 'contacts', { payload: contactsPayload}, (test) => {
 it('should allow Create Update Search for /contacts', () => {
    key="Email Addresses.Email Address";
    return cloud.post(test.api,contactsPayload)
	.then(r => cloud.patch(test.api,updatedPayload))
	.then(r => test.withApi(`${test.api}/search`).withOptions({ qs: { key: '${key}',value:'${value}' } }).should.return200OnGet());
});
});

