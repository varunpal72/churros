'use strict';

const tester = require('core/tester')();

tester.for('helpdesk', 'incidents', (api) => {
  tester.test.badGet404(api);
  tester.test.badPatch404(api);
  tester.test.badPost400(api, {});
  tester.test.badPost400(api);
});
