'use strict';

const suite = require('core/suite');

suite.forElement('esignature', 'agreement-asset-events', {skip: true}, (test) => {
  let date = new Date();
  let startIndex = 0;
  let endIndex = 19;
  let currentDate = date.toISOString().substring(startIndex, endIndex);
  let startDate = date.setDate(date.getDate() - 10);
  let oldDate = new Date(startDate);
  startDate = oldDate.toISOString().substring(startIndex, endIndex);

  test
    .withOptions({ qs: { where: `startDate = '${startDate}' and endDate = '${currentDate}'` } })
    .should.return200OnGet();
});
