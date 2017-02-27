'use strict';

const suite = require('core/suite');
const payload = require('./assets/incident-types');

suite.forElement('helpdesk', 'incident-types', { payload: payload }, (test) => {
  const updatePayload = {
    "displayOrder": 789
  };

  test.withOptions({ churros: { updatePayload: updatePayload } }).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'lastModifiedDate = `2014-01-15T00:00:00.000Z`' } }).should.return200OnGet();

});
