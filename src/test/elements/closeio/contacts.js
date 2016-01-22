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
  it(util.format('should allow CRUDS for %s', api), () => {
    return chakram.get('/hubs/crm/accounts')
      .then(r => {
        expect(r).to.have.status(200);
        expect(r.body).to.not.be.empty;
        const leadId = r.body[0].id;

        const payload = gen({ lead_id: leadId });
        return common.cruds(api, payload, schema);
      });
  });

  common.testPaginate(api, schema);
  common.testBadGet404(api);
  common.testBadPatch404(api);
  common.testBadPost400(api, {});
  common.testBadPost400(api);
});
