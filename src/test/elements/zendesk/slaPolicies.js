'use strict';

const suite = require('core/suite');
const payload = require('./assets/slaPolicies');

const options = {
 churros: {
   updatePayload: {
     "title": "20Sep2017zz"
   }
 }
};

suite.forElement('helpdesk', 'slaPolicies', { payload: payload, skip: false }, (test) => {
 test.withOptions(options).should.supportCruds();
});
