'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "employeeid": tools.random(),
  "title": tools.random(),
  "locationid": "100",
  "departmentid": "10",
  "supervisorid": "1",
  "birthdate": {
    "year": 1999,
    "month": "10",
    "day": 20
  },
  "startdate": {
    "year": 2000,
    "month": "12",
    "day": "3"
  },
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
      "phone1": "(781) 756 3725",
      "phone2": "(781) 756-3724",
      "cellphone": "(978) 902-0815",
      "pager": "(781) 756 3725",
      "fax": "(781) 756 3725",
      "email1": "changeme1@intacct.com",
      "email2": "changeme1@intacct.com",
      "url1": "www.ce1.com",
      "url2": "www.ce2.com",
      "mailaddress": {
        "address1": "addison treehouse",
        "address2": "122223",
        "city": "Andover",
        "state": "MA",
        "zip": "18100",
        "country": "USA"
      }
    }
  },
  "contactlist": {
    "contactitem": {
      "category": "PRIMARY ADDRESS",
      "contactname": "John Pearce"
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
});
