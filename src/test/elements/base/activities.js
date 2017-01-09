'use strict';

const suite = require('core/suite');
const activities = require('./assets/activities');

suite.forElement('crm', 'activities', { payload: activities, skip: true }, (test) => {
  test.should.supportCruds();
});
