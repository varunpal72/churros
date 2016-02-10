'use strict';

const tools = require('core/tools');
const tester = require('core/tester');
const schema = require('./assets/contact.schema');

const gen = (opts) => {
  opts = opts ? opts : {};
  const random = tools.random();
  return new Object({
    lead_id: (opts.lead_id),
    name: (opts.name || 'mr. churros ' + random),
    officeEmail: (opts.officeEmail || 'churros@churros.com')
  });
};

const genAccount = (opts) => new Object({
  name: 'churros account name'
});

tester.for('crm', 'contacts', (api) => {
  it('should allow CRUDS for ' + api, () => {
    let accountId;
    return tester.post('/hubs/crm/accounts', genAccount())
      .then(r => accountId = r.body.id)
      .then(r => tester.cruds(api, gen({ lead_id: accountId }), schema))
      .then(r => tester.delete('/hubs/crm/accounts/' + accountId));
  });

  tester.test.paginate(api, schema);
  tester.test.badGet404(api);
  tester.test.badPatch404(api);
  tester.test.badPost400(api, {});
  tester.test.badPost400(api);
});
