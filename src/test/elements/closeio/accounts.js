'use strict';

const tools = require('core/tools');
const tester = require('core/tester');
const schema = require('./assets/account.schema');

const gen = (opts) => {
  opts = opts ? opts : {};
  const random = tools.random();
  return new Object({
    name: (opts.name || 'mr. churros ' + random)
  });
};

tester.for('crm', 'accounts', (api) => {
  tester.test.cruds(api, gen(), schema);
});
