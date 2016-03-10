'use strict';

const cloud = require('core/cloud');
const logger = require('winston');
const expect = require('chakram').expect;

var exports = module.exports = {};

/**
 * any persisted values
 */
let saved = {};

const KEY = 'notification.webhook.failure.policy';

exports.snapshot = () => {
  logger.debug('Attempting to save settings in case they are modified during testing');

  return cloud.get('accounts/settings')
    .then(r => saved.policy = r.body[KEY]);
};

exports.restore = () => {
  logger.debug('Restoring the following settings in case they were modified during testing: ' + JSON.stringify(saved));
  if (!saved.policy) return;

  return cloud.patch("accounts/settings", { 'notification.webhook.failure.policy': saved.policy })
    .then(r => expect(r.body[KEY]).to.equal(saved.policy));
};
