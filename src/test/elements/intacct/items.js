'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = tools.requirePayload(`${__dirname}/assets/items.json`);

suite.forElement('finance', 'items', { payload: payload }, (test) => {
  var options = { churros: { updatePayload: { "name": tools.random() } } };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
