'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const chocolate = require('core/chocolate');
const tester = require('core/tester');
const schema = require('./assets/contact.schema');

const gen = (opts) => {
  opts = opts ? opts : {};
  const random = chocolate.random();
  return new Object({
    lead_id: (opts.lead_id),
    name: (opts.name || 'mr. churros ' + random),
    officeEmail: (opts.officeEmail || 'churros@churros.com')
  });
};

tester.for('crm', 'contacts', (api) => {
  it('should allow CRUDS for ' + api, () => {
    return chakram.get('/hubs/crm/accounts')
      .then(r => {
        expect(r).to.have.status(200);
        expect(r.body).to.not.be.empty;
        const leadId = r.body[0].id;

        const payload = gen({
          lead_id: leadId
        });
        return tester.cruds(api, payload, schema);
      });
  });

  tester.test.paginate(api, schema);
  tester.test.badGet404(api);
  tester.test.badPatch404(api);
  tester.test.badPost400(api, {});
  tester.test.badPost400(api);
});
