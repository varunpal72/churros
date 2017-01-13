'use strict';

const suite = require('core/suite');
const payload = require('./assets/company');
const cloud = require('core/cloud');
suite.forElement('db', 'Company', { payload: payload }, (test) => {
  it('should allow CRUDS for company', () => {
    let companyId;
    return cloud.post(test.api, payload)
      .then(r => companyId = r.body.CompanyId)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${companyId}`))
      .then(r => cloud.patch(`${test.api}/${companyId}`, payload))
      .then(r => cloud.delete(`${test.api}/${companyId}`));
  });
});
