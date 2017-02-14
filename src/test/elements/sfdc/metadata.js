'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const uri = '/hubs/crm/objects/contact/metadata';

suite.forElement('crm', 'metadata', (test) => {
    it('should include filterable, createable, and updateable for metadata', () => {
        return cloud.get(uri)
            .then(r => {
                let metadata = r.body.fields[0];
                expect(metadata.filterable).to.exist;
                expect(metadata.createable).to.exist;
                expect(metadata.updateable).to.exist;
            });
    });
});
