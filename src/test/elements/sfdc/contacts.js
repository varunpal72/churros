'use strict';

const tester = require('core/tester');
const schema = require('./assets/contact.schema.json');

const gen = (opts) => new Object({
  FirstName: (opts.FirstName || 'churros'),
  LastName: (opts.LastName || 'sauce')
});

tester.forElement('crm', 'contacts', gen({}), schema, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
});
