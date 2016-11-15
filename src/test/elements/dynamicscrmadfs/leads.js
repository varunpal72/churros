'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  const options = {
      churros: {
          updatePayload: {
              "firstName": "Sideshow",
              "lastName": "Robert",
              "email": "weirdclown@springfield.il"
          }
      }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});
