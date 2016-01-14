'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const auth = require('core/util/auth');

var exports = module.exports = {};

exports.all = () => {
  const url = '/instances';
  return chakram.get(url)
    .then((r) => {
      console.log(util.format('Found %s element instances', r.body.size));
      expect(r).to.have.status(200);
      return r.body[0].id;
    });
};

exports.delete = (id) => {
  const url = '/instances/' + id;
  return chakram.delete(url)
    .then((r) => {
      console.log('Deleted element instance with ID: ' + id);
      expect(r).to.have.status(200);
      auth.reset(); // resets auth to our standard User <>, Organization <>
      return r.body;
    });
};
