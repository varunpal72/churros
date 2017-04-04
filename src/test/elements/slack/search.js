'use strict';

const suite = require('core/suite');
const  searchField='query="a"';

suite.forElement('collaboration','search',(test) => {
  test.withOptions({qs: {'where': searchField}}).should.return200OnGet();
  test.withOptions({qs: {'where': searchField}}).should.supportPagination();
});


suite.forElement('collaboration','search-files',(test) => {
  test.withOptions({qs: {'where': searchField}}).should.return200OnGet();
  test.withOptions({qs: {'where': searchField}}).should.supportPagination();
  });

  suite.forElement('collaboration','search-messages',(test) => {
    test.withOptions({qs: {'where': searchField}}).should.return200OnGet();
    test.withOptions({qs: {'where': searchField}}).should.supportPagination();
    });
