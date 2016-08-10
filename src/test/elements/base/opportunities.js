const suite = require('core/suite');
const opportunities = require('./assets/opportunities');

suite.forElement('crm', 'opportunities', { payload: opportunities }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
