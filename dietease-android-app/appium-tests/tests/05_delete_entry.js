/**
 * TEST 05 — Delete Entry
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Delete Entry',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to Today screen
    await clickTab(driver, 'today');

    // Ensure we have at least one logged item
    let logItem = await findByText(driver, 'Parle-G Biscuits');
    let exists = await logItem.isExisting();

    if (!exists) {
      // Go log one
      await clickTab(driver, 'scan');
      const inp = await driver.$('android.widget.EditText');
      await inp.setValue('8901719100018');
      const searchBtn = await driver.$('~Search');
      await searchBtn.click();

      const logBtn = await driver.$('android=new UiSelector().textContains("Log This Food")');
      await logBtn.waitForExist({ timeout: 10000 });
      await logBtn.click();
      await driver.pause(1500);

      // Return to Today screen
      await clickTab(driver, 'today');
      logItem = await findByText(driver, 'Parle-G Biscuits');
      exists = await logItem.isExisting();
    }

    if (!exists) throw new Error('Could not set up logged item for deletion');

    // Find the delete button (contentDescription="Delete")
    const delBtns = await driver.$$('~Delete');
    if (delBtns.length === 0) throw new Error('Delete button not found');

    // Click the delete button
    await delBtns[0].click();
    await driver.pause(1000);

    // Verify it is removed
    const existsAfter = await logItem.isExisting();
    const pass = !existsAfter;

    push('Delete Entry Removes Item from Log', pass, Date.now() - t0, pass ? 'Logged item successfully deleted' : 'Item still exists in log');
  } catch (e) {
    push('Delete Entry Removes Item from Log', false, Date.now() - t0, e.message);
  }

  return results;
};
