'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expenseReportsPayload = require('./assets/expense-reports');


suite.forElement('finance', 'expense-reports', (test) => {

    it('should allow CRUDS /hubs/finance/expense-reports', () => {
      let internalId;
      return cloud.get(test.api)
      .then(r => cloud.post(test.api, expenseReportsPayload))
      .then(r => internalId = r.body.internalId)
       .then(r => cloud.get(`${test.api}/${internalId}`))
       .then(r => cloud.patch(`${test.api}/${internalId}`, {}))
       .then(r => cloud.delete(`${test.api}/${internalId}`));
    });
});
