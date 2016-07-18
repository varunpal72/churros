'use strict';

const suite = require('core/suite');
const payload = require('./assets/tax-rates');
const chakram = require('chakram');

const options = {
  churros: {
    updatePayload: {
     "name": "Best Churros Rate",
     "percentage": "1.23",
     "start_date": "2016-06-22"
    }

  }
};


suite.forElement('accounting', 'tax-rates', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'start_date=\'2016-05-15\''} }).should.return200OnGet();
});
