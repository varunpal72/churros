'use strict';

const chakram = require('chakram');
const util = require('util');

var exports = module.exports = {};

exports.random = () => {
  return Math.random().toString(36).substring(7);
};

exports.authReset = (token) => {
  const props = require('core/props');
  const url = props.get('url');
  const us = props.get('user.secret');
  const os = props.get('org.secret');

  token ?
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: {
        Authorization: util.format('User %s, Organization %s, Element %s', us, os, token)
      }
    }) :
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: {
        Authorization: util.format('User %s, Organization %s', us, os)
      }
    });
};
