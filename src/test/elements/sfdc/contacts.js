'use strict';

const common = require('core/common');
const schema = require('./assets/contact.schema.json');

const gen = (opts) => new Object({
  FirstName: (opts.FirstName || 'churros'),
  LastName: (opts.LastName || 'sauce')
});

// common.for('crm', 'contacts', (api) => {
//   common.testCruds(api, gen({}), schema);
// });
common.for('crm', 'contacts');
