'use strict';

const chakram = require('chakram');
const util = require('util');

var exports = module.exports = {};

exports.random = () => Math.random().toString(36).substring(7);

exports.randomInt = () => Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

exports.authReset = (token) => {
  const props = require('core/props');
  const url = props.get('url');
  const us = props.get('user.secret');
  const os = props.get('org.secret');

  token ?
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: { Authorization: util.format('User %s, Organization %s, Element %s', us, os, token) }
    }) :
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: { Authorization: util.format('User %s, Organization %s', us, os) }
    });
};

exports.logAndThrow = (msg, error, args) => {
  if (args) console.log(msg, args);
  else console.log(msg);
  throw error;
};
