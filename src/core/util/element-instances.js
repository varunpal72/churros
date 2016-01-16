'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const auth = require('core/util/auth');

var exports = module.exports = {};

exports.all = () => {
  const url = '/instances';
  return chakram.get(url)
    .then(r => {
      expect(r).to.have.status(200);
      return r.body;
    })
    .catch(r => {
      console.log('Failed to retrieve element instances: ' + r);
    });
};

exports.create = (instance) => {
  const url = '/instances';
  return chakram.post(url, instance)
    .then(r => {
      expect(r).to.have.status(200);
      console.log('Created element instance with ID: ' + r.body.id);
      return r.body;
    })
    .catch(r => {
      console.log('Failed to create element instance:' + r);
    });
};

exports.delete = (id) => {
  const url = '/instances/' + id;
  return chakram.delete(url)
    .then(r => {
      expect(r).to.have.status(200);
      console.log('Deleted element instance with ID: ' + id);
      auth.reset(); // resets auth to our standard User <>, Organization <>
      return r.body;
    })
    .catch(r => {
      console.log('Failed to delete element instance: ' + r);
    });
};
