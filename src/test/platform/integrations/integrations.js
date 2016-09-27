'use strict';

const suite = require('core/suite');
const payload = require('./assets/integrations');
const schema = require('./assets/integrations.schema');

suite.forPlatform('integrations', { schema, payload }, (test) => {
  it('should allow CRUDS', () => {
    test.should.supportCruds();
  });
});
