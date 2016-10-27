'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ contactKey:tools.randomEmail()});
const updatedPayload  = {
   "contactKey":tools.randomEmail(),
   "attributeSets":[
      {
         "name":"Email Addresses",
         "items":[
            {
               "values":[
                  {
                     "name":"Email Address",
                     "value":tools.randomEmail()
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
};
suite.forElement('marketing', 'contacts', { payload: contactsPayload}, (test) => {
 it('should allow Create Update Search for /contacts', () => {
	let id;
    return cloud.post(test.api,contactsPayload)
	.then(r => id =r.body.contactID)
	.then(r => cloud.patch(`${test.api}/${id}`,updatedPayload))
	.then(r => test.withApi(`${test.api}/search`).withOptions({ qs: { key: 'Email Addresses.Email Address',value:'${tools.randomStr()}' } }).should.return200OnGet());
});
});

