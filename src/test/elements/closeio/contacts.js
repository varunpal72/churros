'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const chocolate = require('core/chocolate');
const common = require('core/common');
const schema = require('./assets/contact.schema');

const gen = (opts) => {
  opts = opts ? opts : {};
  const random = chocolate.random();
  return new Object({
    name: (opts.name || 'mr. churros ' + random),
    officeEmail: (opts.officeEmail || "churros@churros.com"),
    lead_id: (opts.lead_id || "lead_csVBDUGqAk3npH5rUXquNxD8r7HLEvlHuCpdtXqFaDd")
  });
};

common.for('crm', 'contacts', (api) => {
  it('should allow CRUDS for a contact', () => {
    return chakram.get('/hubs/crm/accounts')
      .then(r => {
        expect(r).to.have.status(200);
        expect(r.body).to.not.be.empty;
        const leadId = r.body[0].id;

        return common.cruds(api, gen({ lead_id: leadId }), schema);
      });
  });

  common.test404(api);
  common.testBadPost400(api, {});
});
