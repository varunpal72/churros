'use strict';

const suite = require('core/suite');
const contactsPatch = require('./assets/contactsPatch');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "contactname": tools.random(),
  "printas": tools.random(),
  "companyname": tools.random(),
  "prefix": "Mr.",
  "firstname": tools.random(),
  "lastname": tools.random(),
  "initial": "V.",
  "phone1": "(212) 445-4554",
  "phone2": "(212) 632-7151",
  "cellphone": "(212) 734-1612",
  "pager": "(212) 632-7151",
  "fax": "(212) 641-7937",
  "email1": "AVB1@illustrate.com",
  "email2": "AVB1@illustrate.org",
  "url1": "http://www.illustrate.com",
  "url2": "http://www.illustrate.org",
  "mailaddress": {
    "address1": "368 Outskirts Rd",
    "address2": ", Apt 19",
    "city": "Bronx",
    "state": "NY",
    "zip": "10400",
    "country": "United States"
  }
});
suite.forElement('finance', 'contacts', { payload: payload() }, (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    return cloud.crds(test.api, payload());
  });
  it(`should allow PATCH for ${test.api}/{id}`, () => {
    let customerId;
    return cloud.post(test.api, payload())
      .then(r => customerId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${customerId}`, contactsPatch))
      .then(r => cloud.delete(`${test.api}/${customerId}`));
  });
  test.should.supportPagination();
  test.withName('should support status Ceql search').withOptions({ qs: { where: 'status = \'active\'' } }).should.return200OnGet();
});