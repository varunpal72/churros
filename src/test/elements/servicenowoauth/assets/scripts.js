'use strict';

const webdriver = require('selenium-webdriver');
const props = require('core/props');
const tools = require('core/tools');

module.exports = (element, method) => {
  const config = {
    password: props.getForKey(element, 'password')
  };
  const b = props.get('browser');
  const browser = new webdriver.Builder()
    .forBrowser(b)
    .build();
  switch (method) {
    case 'before':
      browser.get("https://developer.servicenow.com/app.do#!/instance");
      browser.wait(webdriver.until.elementLocated(webdriver.By.id('username')), 10000);
      browser.findElement(webdriver.By.id('username')).clear();
      browser.findElement(webdriver.By.id('username')).sendKeys('developer@cloud-elements.com');
      browser.sleep(1500);
      browser.findElement(webdriver.By.id('password')).clear();
      browser.findElement(webdriver.By.id('password')).sendKeys(config.password);
      browser.findElement(webdriver.By.id('submitButton')).click();
      browser.sleep(3000);
      browser.get("https://developer.servicenow.com/app.do#!/instance");
      browser.sleep(5000);
      return browser.wait(() => browser.isElementPresent(webdriver.By.id('instanceWakeUpBtn')), 5000)
        .then(r => browser.findElement(webdriver.By.id('instanceWakeUpBtn')))
        .then(r => r.click())
        .thenCatch(r => false)
        .then(r => browser.getCurrentUrl());

    default:
      return null;
  }
};
