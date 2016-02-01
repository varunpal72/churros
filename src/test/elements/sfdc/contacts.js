'use strict';

const tester = require('core/tester')();
const schema = require('./assets/contact.schema.json');

const gen = (opts) => new Object({
  FirstName: (opts.FirstName || 'churros'),
  LastName: (opts.LastName || 'sauce')
});

tester.for('crm', 'contacts', (api) => {
  tester.test.cruds(api, gen({}), schema);
});
