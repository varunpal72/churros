'use strict';

const webdriver = require('selenium-webdriver');
const props = require('core/props');
const tools = require('core/tools');

module.exports = (element, method) => {
  const b = props.get('browser');
  const wakeUpInstanceUrl = "https://developer.servicenow.com/app.do#!/instance";
  const config = {
    password: props.getForKey(element, 'dev.password'),
    username: props.getForKey(element, 'dev.username')
  };
  const browser = new webdriver.Builder()
    .forBrowser(b)
    .build();
  switch (method) {
    case 'before':
      // Stay woke
      browser.get(wakeUpInstanceUrl);
      browser.sleep(5000);
      browser.wait(webdriver.until.elementLocated(webdriver.By.id('username')), 10000);
      browser.findElement(webdriver.By.id('username')).clear();
      browser.findElement(webdriver.By.id('username')).sendKeys(config.username);
      browser.sleep(1500);
      browser.findElement(webdriver.By.id('password')).clear();
      browser.findElement(webdriver.By.id('password')).sendKeys(config.password);
      browser.findElement(webdriver.By.id('submitButton')).click();
      browser.sleep(5000);
      browser.get(wakeUpInstanceUrl);
      browser.sleep(10000);
      return browser.wait(() => browser.isElementPresent(webdriver.By.id('instanceWakeUpBtn')), 5000)
        .then(r => browser.findElement(webdriver.By.id('instanceWakeUpBtn')))
        .then(r => r.click())
        .thenCatch(r => {
          console.log('inside catch');
          return r;
        })
        .thenFinally(r => browser.getCurrentUrl());

    default:
      return null;
  }
};
