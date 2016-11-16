'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ company: tools.randomStr(), contactPerson: tools.randomStr(), contactPersonJobTitle: tools.randomStr(), email : tools.randomEmail()}); 

suite.forElement('crm', 'contacts', { payload: contactsPayload }, (test) => {
     it('should allow RU for /hub/crm/contacts', () => {
        return cloud.get(test.api)
          .then(r => cloud.withOptions({ qs: {locale:'en_US' }}).put(test.api,payload));
      });
});
