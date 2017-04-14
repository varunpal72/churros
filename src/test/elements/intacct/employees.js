'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const faker = require('faker');

const payload = () => ({
  "employeeid": faker.internet.userName(),
  "title": tools.random(),
  "bsfield": "word",
  "employeetype": "Full Time",
  "gender": "male",
  "status": "active",
  "currency": "USD",
  "externalid": "ext123",
  "personalinfo": {
    "contact": {
      "contactname": tools.random(),
      "printas": tools.random(),
      "companyname": tools.random(),
      "prefix": "Ms",
      "firstname": tools.random(),
      "lastname": tools.random(),
      "initial": tools.random(),
      "phone1": faker.phone.phoneNumber(),
      "cellphone": faker.phone.phoneNumber(),
      "pager": faker.phone.phoneNumber(),
      "fax": faker.phone.phoneNumber(),
      "email1": tools.random()+ "changeme1@intacct.com",
      "url1": faker.internet.url(),
      "url2": faker.internet.url(),
      "mailaddress": {
        "address1": faker.address.streetAddress(),
        "city": faker.address.city(),
        "state": faker.address.state(),
        "zip": faker.address.zipCode(),
        "country": "USA"
      }
    }
  }
});

const employeesPatch = (contactName) => ({
  "title": tools.random(),
  "locationid": "100",
  "departmentid": "10",
  "supervisorid": "1",
  "birthdate": {
    "year": "1999",
    "month": "10",
    "day": 20
  },
  "startdate": {
    "year": 2000,
    "month": "12",
    "day": "3"
  },
  "enddate": {
    "year": 2016,
    "month": "12",
    "day": "20"
  },
  "terminationtype": "voluntary",
  "employeetype": "Full Time",
  "gender": "male",
  "status": "active",
  "currency": "USD",
  "personalinfo": {
    "contactname": contactName
  },
  "contactlist": {
    "contactitem": {
      "category": "PRIMARY ADDRESS",
      "contactname": "John Pearce"
    }
  }
});

suite.forElement('finance', 'employees', { payload: payload() }, (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    return cloud.crds(test.api, payload());
  });
  it(`should allow PATCH for ${test.api}/{id}`, () => {
    let employeeId, contactName;
    return cloud.post(test.api, payload())
      .then(r => employeeId = r.body.id)
      .then(r => cloud.get(`${test.api}/${employeeId}`))
      .then(r => contactName = r.body.personalinfo.contact.contactname)
      .then(r => cloud.patch(`${test.api}/${employeeId}`, employeesPatch(contactName)))
      .then(r => cloud.delete(`${test.api}/${employeeId}`));
  });
  test.should.supportPagination();
  test.withName('should support updated > {date} Ceql search').withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
