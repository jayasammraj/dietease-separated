/**
 * TEST 04 — Food Logging
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Food Logging',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to scan screen
    await clickTab(driver, 'scan');

    // Input barcode
    const inp = await driver.$('android.widget.EditText');
    await inp.setValue('8901719100018');

    // Click search icon button
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();

    // Wait for card and click 'Log This Food'
    const logBtn = await driver.$('android=new UiSelector().textContains("Log This Food")');
    await logBtn.waitForExist({ timeout: 10000 });
    await logBtn.click();
    await driver.pause(1500); // Wait for save operation

    // Navigate to Today screen
    await clickTab(driver, 'today');

    // Check if food log item exists in the list
    const logItem = await findByText(driver, 'Parle-G Biscuits');
    await logItem.waitForExist({ timeout: 5000 });
    const pass = await logItem.isDisplayed();

    push('Log Food Adds Item to Daily Log', pass, Date.now() - t0, pass ? 'Logged item is visible in Today tab' : 'Logged item not found in Today tab');
  } catch (e) {
    push('Log Food Adds Item to Daily Log', false, Date.now() - t0, e.message);
  }

  return results;
};
