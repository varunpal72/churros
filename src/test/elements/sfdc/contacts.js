'use strict';

const suite = require('core/suite');

const gen = (opts) => new Object({
  FirstName: (opts.FirstName || 'churros'),
  LastName: (opts.LastName || 'sauce')
});

suite.forElement('crm', 'contacts', gen({}), (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
});
