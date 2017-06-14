'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const moment = require('moment');

const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const opportunitiesPayload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);
const dealsPayload = tools.requirePayload(`${__dirname}/assets/deals.json`);
const leadsPayload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const activitiesPayload = {
   "ActivityFunctionCode" : "APPOINTMENT",
    "ActivityStartDate" : "2017-02-09T13:00:00+07:00",
    "ActivityEndDate" : "2017-02-09T14:00:00+07:00",
    "Subject" : "Fancy 2 activity"
};
let now = moment().add(1, 'd').format('YYYY-MM-DD');

activitiesPayload.ActivityStartDate =  now + 'T' + activitiesPayload.ActivityStartDate.split('T')[1];
activitiesPayload.ActivityEndDate = now + 'T' + activitiesPayload.ActivityEndDate.split('T')[1];

suite.forElement('crm', 'polling', null, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
  test.withApi('/hubs/crm/deals').should.supportPolling(dealsPayload, 'deals');
  test.withApi('/hubs/crm/leads').should.supportPolling(leadsPayload, 'leads');
  test.withApi('/hubs/crm/activities').should.supportPolling(activitiesPayload, 'activities');
});
