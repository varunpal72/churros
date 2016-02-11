'use strict';

const suite = require('core/suite');
const schema = require('./assets/contact.schema.json');

const gen = (opts) => new Object({
  FirstName: (opts.FirstName || 'churros'),
  LastName: (opts.LastName || 'sauce')
});

suite.forElement('crm', 'contacts', gen({}), schema, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
});
