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

tester.forElement('crm', 'contacts', gen(), schema, (suite) => {
  it('suite.should allow CRUDS for ' + suite.api, () => {
    let accountId;
    return tester.post('/hubs/crm/accounts', { name: 'churros tmp account' })
      .then(r => accountId = r.body.id)
      .then(r => tester.cruds(suite.api, gen({ lead_id: accountId }), schema))
      .then(r => tester.delete('/hubs/crm/accounts/' + accountId));
  });

  suite.should.supportPagination();
  suite.should.return404OnGet();
  suite.should.return404OnPatch();
  suite.should.return400OnPost();
  suite.withJson({}).should.return400OnPost();
});
