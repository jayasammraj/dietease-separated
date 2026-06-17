/**
 * DietEase+ Appium Tests — Android Emulator / Device Setup (Samsung SM-A166P)
 */
const { remote } = require('webdriverio');
const path = require('path');

const DEFAULT_TIMEOUT = 10000;
const APP_PACKAGE = 'com.example.dieteasy';

async function buildDriver() {
  const apkPath = path.resolve(__dirname, '../../app/build/outputs/apk/debug/app-debug.apk');
  const opts = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
      platformName: 'Android',
      'appium:deviceName': process.env.DEVICE_NAME || 'SM-A166P',
      'appium:udid': process.env.DEVICE_UDID || 'R9ZXA0BDBTM',
      'appium:automationName': 'UiAutomator2',
      'appium:app': apkPath,
      'appium:newCommandTimeout': 300,
      'appium:ensureWebviewsHavePages': true,
      'appium:nativeWebScreenshot': true,
      'appium:connectHardwareKeyboard': true,
      'appium:autoGrantPermissions': true // Auto grant camera/storage permissions
    },
    logLevel: 'error'
  };
  
  const driver = await remote(opts);
  return driver;
}

/**
 * Resets the application state by restarting it
 */
async function navigateTo(driver) {
  await driver.terminateApp(APP_PACKAGE);
  await driver.activateApp(APP_PACKAGE);
  await driver.pause(2000);
}

/**
 * Clicks a navigation tab in the bottom bar
 * tabName: 'scan', 'today', 'history', 'products'
 */
async function clickTab(driver, tabName) {
  const labelMap = {
    scan: 'Scan',
    today: 'Today',
    history: 'History',
    products: 'Products'
  };
  const label = labelMap[tabName.toLowerCase()] || 'Scan';
  
  // Try locating by text first (matches Compose text label), then fallback to accessibility id
  let tabEl = await driver.$(`android=new UiSelector().text("${label}")`);
  const exists = await tabEl.isExisting();
  if (!exists) {
    tabEl = await driver.$(`~${label}`);
  }
  
  await tabEl.waitForExist({ timeout: DEFAULT_TIMEOUT });
  await tabEl.click();
  await driver.pause(1000);
}

/**
 * Utility to find element by text
 */
async function findByText(driver, text) {
  return await driver.$(`android=new UiSelector().text("${text}")`);
}

/**
 * Utility to find element containing text
 */
async function findByTextContains(driver, text) {
  return await driver.$(`android=new UiSelector().textContains("${text}")`);
}

module.exports = {
  buildDriver,
  navigateTo,
  clickTab,
  findByText,
  findByTextContains,
  APP_PACKAGE,
  DEFAULT_TIMEOUT
};
