'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/employees.json`);

suite.forElement('humancapital', 'employees', { payload: payload }, (test) => {
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
                         } }).should.supportPagination('id');

});
