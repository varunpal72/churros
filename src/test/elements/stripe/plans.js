'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = () => ({
  "amount": tools.randomInt(),
  "interval": "month",
  "name": tools.random(),
  "currency": "usd",
  "id": tools.random()
});

 const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };
suite.forElement('payment', 'plans', { payload: payload() }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.withApi(test.api).withOptions({ qs: { where: `created >= 1463157076` } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
