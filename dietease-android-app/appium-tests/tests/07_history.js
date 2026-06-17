/**
 * TEST 07 — History
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'History',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to Scan, log an item first to ensure history is populated
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.setValue('8901719100018');
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();

    const logBtn = await driver.$('android=new UiSelector().textContains("Log This Food")');
    await logBtn.waitForExist({ timeout: 10000 });
    await logBtn.click();
    await driver.pause(1500);

    // Navigate to History Screen
    await clickTab(driver, 'history');
    
    // Check if History sidebar contains "Today"
    const todayItem = await findByText(driver, 'Today');
    await todayItem.waitForExist({ timeout: 5000 });
    
    // Click "Today" in the sidebar
    await todayItem.click();
    await driver.pause(1000);

    // Verify right-side list contains "Parle-G Biscuits"
    const itemDetail = await findByText(driver, 'Parle-G Biscuits');
    const pass = await itemDetail.isDisplayed();

    // Clean up by going back to Today and deleting the entry
    await clickTab(driver, 'today');
    const delBtns = await driver.$$('~Delete');
    if (delBtns.length > 0) {
      await delBtns[0].click();
      await driver.pause(500);
    }

    push('History Screen Shows Past Entries', pass, Date.now() - t0, pass ? 'Selected day details displayed logged items' : 'Logged item not found in history detail');
  } catch (e) {
    push('History Screen Shows Past Entries', false, Date.now() - t0, e.message);
  }

  return results;
};
