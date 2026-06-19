/**
 * DietEase+ Appium Tests — Android Emulator / Device Setup (Samsung SM-A166P)
 */
const { remote } = require('webdriverio');
const path = require('path');

const DEFAULT_TIMEOUT = 10000;

// Default test credentials (guest account auto-registered on first launch)
const TEST_EMAIL    = 'guest@dietease.com';
const TEST_PASSWORD = 'password';
const APP_PACKAGE = 'com.example.dieteasy';

// Detect if running on emulator (CI) vs real device
const IS_EMULATOR = (process.env.DEVICE_NAME || '').toLowerCase().includes('emulator');

async function buildDriver() {
  const apkPath = path.resolve(__dirname, '../../app/build/outputs/apk/debug/app-debug.apk');
  const caps = {
    platformName: 'Android',
    'appium:deviceName': process.env.DEVICE_NAME || 'SM-A166P',
    'appium:udid': process.env.DEVICE_UDID || 'R9ZXA0BDBTM',
    'appium:automationName': 'UiAutomator2',
    'appium:app': apkPath,
    'appium:newCommandTimeout': 300,
    'appium:ensureWebviewsHavePages': true,
    'appium:nativeWebScreenshot': true,
    'appium:autoGrantPermissions': true,
    // Only use hardware keyboard on real device; emulator needs soft keyboard for setValue
    'appium:connectHardwareKeyboard': !IS_EMULATOR,
  };
  const opts = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: caps,
    logLevel: 'error'
  };
  
  const driver = await remote(opts);
  return driver;
}

/**
 * Logs in with the guest test account.
 * Call this whenever the app is freshly launched (login screen is showing).
 */
async function loginToApp(driver) {
  // Check if login screen is visible by looking for the Log In button
  try {
    const loginBtn = await driver.$('android=new UiSelector().text("Log In")');
    const loginVisible = await loginBtn.isExisting();
    if (!loginVisible) return; // already logged in, nothing to do

    // Fill email
    const emailField = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
    await emailField.waitForExist({ timeout: 5000 });
    await emailField.click();
    await emailField.clearValue();
    await emailField.setValue(TEST_EMAIL);

    // Fill password
    const passwordField = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)');
    await passwordField.waitForExist({ timeout: 5000 });
    await passwordField.click();
    await passwordField.clearValue();
    await passwordField.setValue(TEST_PASSWORD);

    // Dismiss keyboard and tap Log In
    try { await driver.hideKeyboard(); } catch (_) { /* emulator may not have keyboard to hide */ }
    await driver.pause(500);
    await loginBtn.click();

    // Wait for main app to load (nav tabs appear)
    await driver.pause(3000);
  } catch (e) {
    // If login screen not found or already past it — silently continue
  }
}

/**
 * Resets the application state by restarting it, then logs in
 */
async function navigateTo(driver) {
  await driver.terminateApp(APP_PACKAGE);
  await driver.activateApp(APP_PACKAGE);
  await driver.pause(2000);
  await loginToApp(driver);
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
  loginToApp,
  navigateTo,
  clickTab,
  findByText,
  findByTextContains,
  APP_PACKAGE,
  DEFAULT_TIMEOUT
};
