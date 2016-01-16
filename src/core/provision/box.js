'use strict';

const ei = require('core/util/element-instances');
const webdriver = require('selenium-webdriver');

var exports = module.exports = {};

exports.create = () => {
  return ei.create('box', (r, username, password, driver) => {
    driver.get(r.body.oauthUrl);
    driver.findElement(webdriver.By.name('login')).sendKeys(username);
    driver.findElement(webdriver.By.name('password')).sendKeys(password);
    driver.findElement(webdriver.By.name('login_submit')).click();
    driver.findElement(webdriver.By.name('consent_accept')).click();
    return driver.getCurrentUrl();
  });
};
