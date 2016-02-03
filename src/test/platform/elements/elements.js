'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const tester = require('core/tester')();
const elements = require('core/elements');
const metadataSchema = require('./assets/element.metadata.schema.json');

tester.for(null, 'elements', (api) => {

  it('metadata should contain element metadata)', () => {
    return elements.get('sfdc')
      .then(r => {
      const url = util.format('%s/%s/metadata', api, r.body.id);
      return tester.get(url, metadataSchema);
    });
  });
});
