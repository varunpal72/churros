'use strict';

const suite = require('core/suite');

suite.forElement('employee', 'locations/APP5JTYW917TW/payments', (test) => {

    test.should.supportPagination();
    test.withOptions({ qs: { where: "begin_time='2017-10-03T18:18:45Z' and end_time='2017-10-03T20:14:57Z'" } }).should.return200OnGet();

    test.should.supportSr();
});
