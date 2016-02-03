'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
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

tester.for('crm', 'contacts', (api) => {
  it('should allow CRUDS for ' + api, () => {
    return tester.get('/hubs/crm/accounts')
      .then(r => {
        expect(r.body).to.not.be.empty;
        const payload = gen({ lead_id: r.body[0].id });
        return tester.cruds(api, payload, schema);
      });
  });

  tester.test.paginate(api, schema);
  tester.test.badGet404(api);
  tester.test.badPatch404(api);
  tester.test.badPost400(api, {});
  tester.test.badPost400(api);
});
