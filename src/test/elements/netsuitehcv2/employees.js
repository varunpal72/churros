'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/employees');
const build = (overrides) => Object.assign({}, payload, overrides);
const employeesPayload = build({ firstName: tools.random(), lastName: tools.random() });

suite.forElement('humancapital', 'employees', { payload: employeesPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "title": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination('id');
  test.should.supportCeqlSearch('id');
  test.withOptions({ qs: { page: 1,
                           pageSize: 5,
                           where : "savedSearchId = '712'"
                         } }).should.supportPagination();

});
