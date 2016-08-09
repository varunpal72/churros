const suite = require('core/suite');
const notes = require('./assets/notes');

suite.forElement('crm', 'notes', { payload: notes }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
