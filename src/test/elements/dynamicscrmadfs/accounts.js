'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  const options = {
      churros: {
          updatePayload: {
              "name": "Robot Account Updated 1"
          }
      }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});
