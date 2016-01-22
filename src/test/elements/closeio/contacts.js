'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const chocolate = require('core/chocolate');
const common = require('core/common');
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

common.for('crm', 'contacts', (api) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => {
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
