'use strict';

const tester = require('core/tester');
const schema = require('./assets/%name.schema.json');

tester.for(null, '%name', (api) => {
  // checkout functions available under tester.test which provide a lot of pre-canned tests
  // i.e.  tester.test.cruds(api, payload, schema)
  //       tester.test.badGet404(api);
  //       tester.test.badPost400(api);

  it('%user should insert some tests here :)', () => true);
});
