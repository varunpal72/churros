const suite = require('core/suite');
const leads = require('./assets/leads');

suite.forElement('crm', 'leads', { payload: leads, skip: true }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
