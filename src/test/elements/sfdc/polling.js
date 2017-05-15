'use strict';

const suite = require('core/suite');
const accountsPayload = require('./assets/accounts');
const campaignsPayload = require('./assets/campaigns');

suite.forElement('crm', 'polling', null, (test) => {
// Possible issue, all pollers are hitting the same session on keiths app. Just randomize the session
// before each poller test runs. Instead of config.eventCallbackUrl = `https://knappkeith.pythonanywhere.com/request/${tools.random()}/`;
// in the props file change it to config.eventCallbackUrl = `https://knappkeith.pythonanywhere.com/request/<<random.whatever>>/`;
// and then use the tools.fake() on each itPoller call. This way it won't fuck up anything else if someone wants to change that url
// Also I came up with that solution while typing this, because hell yea.

// To test if that works run the 2 tests below both uncommented and the second should always fail and the first should pass
// then comment the first and make sure the second fails. do same with second nut that one should pass

  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload);
  test.withApi('/hubs/crm/campaigns').should.supportPolling(campaignsPayload);

});
