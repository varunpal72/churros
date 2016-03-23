'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');

const incidentsUpdate = () => ({
  "subject": "Updated",
  "status": "pending",
  "custom_fields": {
    "level": "super"
  }
});

const options = {
  churros: {
    updatePayload: incidentsUpdate()
  }
};

suite.forElement('helpdesk', 'incidents', payload, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({qs: {where: 'email=\'support@desk.com\''}}).should.return200OnGet();
});
