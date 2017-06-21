'use strict';

const webdriver = require('selenium-webdriver');
const props = require('core/props');
const tools = require('core/tools');
const logger = require('winston');

const doWork = (url, browser, config) => {
  if (url) {
    browser.get(url);
    browser.wait(webdriver.until.elementLocated(webdriver.By.id('paypalLogo')), 15000); //extremely slow load times
    browser.switchTo().frame("injectedUl");
    browser.wait(webdriver.until.elementLocated(webdriver.By.id('email')), 10000);
    browser.findElement(webdriver.By.id('email')).clear();
    browser.findElement(webdriver.By.id('email')).sendKeys(config.username);
    browser.sleep(2000);
    browser.findElement(webdriver.By.id('password')).clear();
    browser.findElement(webdriver.By.id('password')).sendKeys(config.password);
    browser.findElement(webdriver.By.id('btnLogin')).click();
    browser.switchTo().defaultContent();
    browser.wait(() => browser.isElementPresent(webdriver.By.id('//*[@id="confirmButtonTop"]')), 15000) //extremely slow load times
      .thenCatch(r => true); // ignore
    browser.findElement(webdriver.By.xpath('//*[@id="confirmButtonTop"]'))
      .then((element) => element.click(), (err) => {}); // ignore this
    browser.sleep(2000); //Paypal takes some time to confirm creds
    return browser.getCurrentUrl();
  } else {
    throw Error(`The authorization URL was empty. Please verify you are using a PayPal Business account and are creating a merchant payment.`);
  }
};

const attemptAuthorization = (attempt, b, url, config) => {
  const browser = new webdriver.Builder()
    .forBrowser(b)
    .build();
  return browser.call(() => doWork(url, browser, config))
    .then(url => {
      browser.close();
      return url;
    })
    .catch(e => {
      if (attempt > 2) {
        logger.debug("Selenium automation err'd out during PayPal buyer authentication, retrying.");
        return attemptAuthorization(++attempt, b, url, config);
      } else {
        browser.close();
        tools.logAndThrow(`Selenium automation err'd out 2 times during PayPal buyer authentication.`, e);
      }
    });
};

module.exports = (element, url) => {
  const b = props.get('browser');
  const config = {
    password: props.getForKey(element, 'buyer.password'),
    username: props.getForKey(element, 'buyer.username')
  };
  logger.debug("Trying selenium automation for PayPal buyer authentication");
  return attemptAuthorization(1, b, url, config);
};
