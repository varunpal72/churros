'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload  =  {
  "company": tools.randomStr,
  "contactPerson": tools.randomStr,
  "contactPersonJobTitle": tools.randomStr,
  "email": tools.randomEmail()

}

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
     it('should allow RU for /contacts', () => {
          return cloud.get(test.api)
          .then(r => cloud.withOptions({ qs: {locale:'en_US' }}).put(test.api,payload));


});
});
