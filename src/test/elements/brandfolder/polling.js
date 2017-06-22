'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const brandfoldersPayload = tools.requirePayload(`${__dirname}/assets/brandfolders2.json`);

suite.forElement('general', 'polling', { skip: true }, (test) => {
  let orgId = -1;
  before(() => cloud.get(`hubs/general/organizations`)
    .then(r => orgId = r.body[0].id)
    .then(r => cloud.get(`hubs/general/organizations/${orgId}`))
  );
  const addFolder = (r) => cloud.post(`hubs/general/organizations/${orgId}/brandfolders`, r)
  test.withApi('/hubs/general/brandfolders').should.supportPolling(brandfoldersPayload, 'brandfolders', addFolder);
});
