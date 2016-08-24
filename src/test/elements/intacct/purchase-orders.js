'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = (vendorId, transactionId) => ({
  "datedue": {
    "month": "08",
    "year": 2010,
    "day": 26
  },
  "transactionstate": "Pending",
  "vendorid": vendorId,
  "basecurr": "USD",
  "potransitems": {
    "potransitem": [
      {
        "itemid": 905,
        "itemdesc": "AP5131 Access Point",
        "unit": "Each",
        "quantity": 2,
        "totalamount": 400,
        "warehouseid": "WH1",
        "price": 200,
        "retailprice": 0
      }
    ]
  },
  "datecreated": {
    "month": "08",
    "year": 2010,
    "day": 26
  },
  "transactiontype": "Purchase Requisition",
  "transactionid": transactionId,
  "termname": "N30",
  "whenmodified": "08/26/2010 09:42:20",
  "returnto": {
    "contactname": "600 MetroNorth Corporate Center, LLC"
  },
  "exchrate": 1,
  "paymentstatus": "Open",
  "currency": "USD",
  "payto": {
    "contactname": "600 MetroNorth Corporate Center, LLC"
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

const purchaseOrder = (journalid) => ({
  "journalid": journalid,
  "datecreated": {
    "year": "2011",
    "month": "03",
    "day": "07"
  },
  "reversedate": {
    "year": "2016",
    "month": "01",
    "day": "30"
  },
  "description": "From XML API",
  "referenceno": "9876",
  "gltransactionentries": {
    "glentry": [
      {
        "trtype": "credit",
        "amount": "9876",
        "glaccountno": "1400",
        "datecreated": {
          "year": "2011",
          "month": "03",
          "day": "07"
        }
      },
      {
        "trtype": "debit",
        "amount": "9876",
        "glaccountno": "1400",
        "datecreated": {
          "year": "2011",
          "month": "03",
          "day": "07"
        }
      }
    ]
  }
});

suite.forElement('finance', 'purchase-orders', { payload: payload() }, (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    let vendorId, transactionId, journalid;
    return cloud.post(`/hubs/finance/vendors`, vendor())
    .then(r => vendorId = r.body.id)
    .then(r => cloud.get(`/hubs/finance/transactions`))
    .then(r => journalid = r.body[0].journalid)
    .then(r => cloud.post(`/hubs/finance/transactions`, purchaseOrder(journalid)))
    .then(r => transactionId = r.body.id)
    .then(r => cloud.crds(test.api, payload(vendorId, transactionId)))
    .then(r => cloud.delete(`/hubs/finance/transactions/${transactionId}`))
    .then(r => cloud.delete(`/hubs/finance/vendors/${vendorId}`));
  });
});
