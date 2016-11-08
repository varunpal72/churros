'use strict';

const suite = require('core/suite');
const activities = require('./assets/activities');

suite.forElement('crm', 'activities', { payload: activities }, (test) => {
  test.should.supportCruds();
});
