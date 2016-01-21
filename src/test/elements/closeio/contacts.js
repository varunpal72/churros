'use strict';

const chocolate = require('core/chocolate');
const common = require('core/common');
const schema = require('./assets/contact.schema')

const gen = (opts) => {
  opts = opts ? opts : {};
  const random = chocolate.random();
  return new Object({
    name: (opts.name || 'mr. churros ' + random),
    officeEmail: (opts.officeEmail || "churros@churros.com"),
    lead_id: (opts.lead_id || "lead_csVBDUGqAk3npH5rUXquNxD8r7HLEvlHuCpdtXqFaDd")
  });
};

common.for('crm', 'contacts', (baseUrl) => {
  common.notFoundTest(baseUrl);
  common.crudTest(baseUrl, gen(), schema);
});
