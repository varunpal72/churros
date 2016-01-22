'use strict';

const tester = require('core/tester');

tester.for('helpdesk', 'incidents', (api) => {
  tester.testBadGet404(api);
  tester.testBadPatch404(api);
  tester.testBadPost400(api, {});
  tester.testBadPost400(api);
});
