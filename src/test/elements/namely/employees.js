'use strict';

const suite = require('core/suite');
const payload = require('./assets/employees');

/*
const options = {
  churros: {
    updatePayload: {
      "preferred_name": "Claudius Julius",
      "personal_email": "test_user3@cloud-elements.com"
    }
  }
};
*/

suite.forElement('humancapital', 'employees', { payload }, (test) => {
  test.should.supportPagination();
  //test.withOptions(options).should.supportCruds();
});
