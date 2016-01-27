'use strict';

const tester = require('core/tester');
const schema = require('./assets/tasks.schema');

tester.for('ocr', 'tasks', () => {
  // checkout functions available under tester.test which provide a lot of pre-canned tests
  // i.e.  tester.test.cruds(api, payload, schema)
  //       tester.test.badGet404(api);
  //       tester.test.badPost400(api);

  it('jjwyse should insert some tests here :)', () => true);
});
