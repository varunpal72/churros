'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = (vendorId) => ({
  "vendorid": vendorId,
  "datecreated": {
    "year": "2010",
    "month": "10",
    "day": "13"
  },
  "dateposted": {
    "year": "2010",
    "month": "10",
    "day": "13"
  },
  "datedue": {
    "year": "2010",
    "month": "10",
    "day": "26"
  },
  "termname": "N30",
  "action": "Draft",
  "billno": tools.random(),
  "ponumber": "222",
  "onhold": false,
  "description": "Description of bill",
  "basecurr": "USD",
  "currency": "USD",
  "exchrate": "0.875",
  "nogl": "F",
  "customfields": {
    "customfield": [
      {
        "customfieldname": "TESTDATE",
        "customfieldvalue": "12/10/2009"
      },
      {
        "customfieldname": "TESTTEXT",
        "customfieldvalue": "CustomFieldText"
      }
    ]
  },
  "billitems": {
    "lineitem": [
      {
        "glaccountno": "2000",
        "amount": "1234.56",
        "customfields": {
          "customfield": [
            {
              "customfieldname": "TESTDATE",
              "customfieldvalue": "12/10/2009"
            },
            {
              "customfieldname": "TESTTEXT",
              "customfieldvalue": "CustomFieldText"
            }
          ]
        },
        "billable": "false"
      }
    ]
  }
});

const vendor = () => ({
  "vendorid": tools.random(),
  "name": tools.random(),
  "termname": "N30",
  "taxid": "39-1837105",
  "creditlimit": "100",
  "billingtype": "openitem",
  "donotcutcheck": "false",
  "comments": tools.random(),
  "status": "active",
  "currency": "USD",
  "onetime": "false",
  "primary": {
    "contact": {
      "contactname": tools.random(),
      "printas": tools.random(),
      "companyname": tools.random(),
      "prefix": "Ms.",
      "firstname": tools.random(),
      "lastname": tools.random(),
      "initial": tools.random(),
      "phone1": "877-446-7746",
      "cellphone": "877-446-7746",
      "pager": "877-446-7746",
      "fax": "877-446-7746",
      "email1": "churros1@gmail.com",
      "url1": "www.ce3.com",
      "mailaddress": {
        "address1": "addison",
        "city": "Dallas",
        "state": "Texas",
        "zip": "76001",
        "country": "USA"
      }
    }
  },
  "returnto": {
    "contact": {
      "contactname": tools.random(),
      "printas": tools.random(),
      "companyname": tools.random(),
      "prefix": "Ms.",
      "firstname": tools.random(),
      "lastname": tools.random(),
      "initial": tools.random(),
      "phone1": "877-446-7746",
      "cellphone": "877-446-7746",
      "pager": "877-446-7746",
      "fax": "877-446-7746",
      "email1": "churros3@gmail.com",
      "url1": "www.ce4.com",
      "mailaddress": {
        "address1": "addison",
        "city": "Dallas",
        "state": "Texas",
        "zip": "76001",
        "country": "USA"
      }
    }
  },
  "payto": {
    "contact": {
      "contactname": tools.random(),
      "printas": tools.random(),
      "companyname": tools.random(),
      "prefix": "Ms.",
      "firstname": tools.random(),
      "lastname": tools.random(),
      "initial": tools.random(),
      "phone1": "877-446-7746",
      "cellphone": "877-446-7746",
      "pager": "877-446-7746",
      "fax": "877-446-7746",
      "email1": "churros5@gmail.com",
      "url1": "www.ce5.com",
      "mailaddress": {
        "address1": "addison",
        "city": "Dallas",
        "state": "Texas",
        "zip": "76001",
        "country": "USA"
      }
    }
  },
  "contactinfo": {
    "contact": {
      "contactname": tools.random(),
      "printas": tools.random(),
      "companyname": tools.random(),
      "prefix": "Ms.",
      "firstname": tools.random(),
      "lastname": tools.random(),
      "initial": tools.random(),
      "phone1": "877-446-7746",
      "cellphone": "877-446-7746",
      "pager": "877-446-7746",
      "fax": "877-446-7746",
      "email1": "churros6@gmail.com",
      "url1": "www.ce6.com",
      "mailaddress": {
        "address1": "addison",
        "city": "Dallas",
        "state": "Texas",
        "zip": "76001",
        "country": "USA"
      }
    }
  },
  "contactlist": {
    "contactitem": {
      "category": "PAYMENT ADDRESS",
      "contactname": "4imprint"
    }
  }
});

suite.forElement('finance', 'bills', { payload: payload() }, (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    let vendorId;
    return cloud.post(`/hubs/finance/vendors`, vendor())
    .then(r => vendorId = r.body.id)
    .then(r => cloud.crds(test.api, payload(vendorId)))
    .then(r => cloud.delete(`/hubs/finance/vendors/${vendorId}`));
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
