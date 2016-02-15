'use strict';

const util = require('util');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const instanceSchema = require('./assets/element.instance.schema.json');

suite.forPlatform('elements/instances', instanceSchema, null, (test) => {

  it('should return element instances', () => {
    return provisioner.create('box')
      .then(r => {
        const id = r.body.id;
        return cloud.get(util.format('/elements/box/instances/%s', id), instanceSchema)
        .then(r => {
          expect(r).to.have.statusCode(200);
          expect(r.body).to.not.be.empty;
          expect(r.body.configuration).to.not.be.empty;
          expect(r.body.configuration['oauth.api.secret']).to.equal("********");
        })
        .then(r => provisioner.delete(id));
      });
  });
});
