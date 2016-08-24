'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = () => ({
  "itemid": tools.random(),
  "name": tools.random(),
  "status": "active",
  "itemtype": "Non-Inventory (Sales only)",
  "productlineid": "Licenses",
  "taxable": "true",
  "cost_method": "Standard",
  "standard_unit": "Each",
  "purchase_unit": "Each",
  "purchase_unit_factor": "1",
  "sales_unit": "Each",
  "sales_unit_factor": "1",
  "glgroup": "Subscriptions",
  "note": "new1",
  "term_period": "Months",
  "computepriceforshortterm": "false",
  "revenue_posting": "Kit Level",
  "vsoecategory": "Product - Specified",
  "vsoerevdefstatus": "Defer until item is delivered"
});

suite.forElement('finance', 'items', { payload: payload() }, (test) => {
  var options = { churros: { updatePayload: { "name": tools.random()}}};
  test.withOptions(options).should.supportCruds();
});
