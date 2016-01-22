'use strict';

const common = require('core/common');

common.for('helpdesk', 'incidents', (api) => {
  common.testBadGet404(api);
  common.testBadPatch404(api);
  common.testBadPost400(api, {});
  common.testBadPost400(api);
});
