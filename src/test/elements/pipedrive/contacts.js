'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({
  name: tools.random(),
  first_name: tools.random(),
  last_name: tools.random(),
  email1: {
    value: tools.randomEmail(),
    label: tools.random()
  },
  email2: {
    value: tools.randomEmail(),
    label: tools.random()
  },
  email3: {
    value: tools.randomEmail(),
    label: tools.random()
  },
  phone1: {
    value: tools.randomInt() + '1234' + tools.randomInt(),
    label: tools.random()
  },
  phone2: {
    value: tools.randomInt() + '3456' + tools.randomInt(),
    label: tools.random()
  },
  phone3: {
    value: tools.randomInt() + '5678' + tools.randomInt(),
    label: tools.random()
  }
});

suite.forElement('crm', 'contacts', { payload: contactsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random(),
        "email1": {
          "value": tools.randomEmail(),
          "label": tools.random()
        },
        "email2": {
          "value": tools.randomEmail(),
          "label": tools.random()
        },
        "email3": {
          "value": tools.randomEmail(),
          "label": tools.random()
        },
        "phone1": {
          "value": tools.randomInt() + '1234' + tools.randomInt(),
          "label": tools.random()
        },
        "phone2": {
          "value": tools.randomInt() + '3456' + tools.randomInt(),
          "label": tools.random()
        },
        "phone3": {
          "value": tools.randomInt() + '5678' + tools.randomInt(),
          "label": tools.random()
        }
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Test Tester\'' } }).should.return200OnGet();
});