const suite = require('core/suite');
const contacts = require('./assets/contacts');

suite.forElement('crm', 'contacts', { payload: contacts }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
