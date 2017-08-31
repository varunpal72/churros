'use strict';

const suite = require('core/suite');
suite.forElement('social', 'comments', { skip: true }, (test) => {
  test.withApi(`/hubs/social/companies/16238355/updates/comments?updateKey=UPDATE-c16238355-6283339617404096512`).should.return200OnGet();
  test
    .withApi(`/hubs/social/companies/16238355/updates/comments?updateKey=UPDATE-c16238355-6283339617404096512?page=17pageSize=1`)
    .withOptions({ qs: { page: 1, pageSize: 1 } });
});
