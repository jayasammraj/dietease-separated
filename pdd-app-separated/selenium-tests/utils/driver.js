/**
 * DietEase+ Selenium Tests — Chrome WebDriver Setup
 */
const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'https://dietease-plus.surge.sh';
const DEFAULT_TIMEOUT = 15000;

async function buildDriver(headless = false) {
  const options = new chrome.Options();
  if (headless) {
    options.addArguments('--headless=new');
  }
  options.addArguments(
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1280,800',
    '--disable-web-security',
    '--allow-running-insecure-content'
  );

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 30000, script: 10000 });
  return driver;
}

async function navigateTo(driver, path = '') {
  await driver.get(BASE_URL + path);
  // Wait for the app to load
  await driver.wait(until.elementLocated(By.className('logo')), DEFAULT_TIMEOUT);
}

async function clickTab(driver, tabName) {
  // tabName: 'scan', 'today', 'history', 'products'
  const tabEl = await driver.findElement(By.id(`nav-${tabName}`));
  await tabEl.click();
  await driver.sleep(500);
}

async function waitForElement(driver, locator, timeout = DEFAULT_TIMEOUT) {
  return await driver.wait(until.elementLocated(locator), timeout);
}

async function getTextSafe(driver, locator) {
  try {
    const el = await driver.findElement(locator);
    return await el.getText();
  } catch {
    return '';
  }
}

async function isVisible(driver, locator) {
  try {
    const el = await driver.findElement(locator);
    return await el.isDisplayed();
  } catch {
    return false;
  }
}

module.exports = { buildDriver, navigateTo, clickTab, waitForElement, getTextSafe, isVisible, By, until, Key, BASE_URL, DEFAULT_TIMEOUT };
