/**
 * TEST 10 — Manual Entry
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Manual Entry',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to scan screen
    await clickTab(driver, 'scan');

    // Input a dummy barcode that doesn't exist
    const inp = await driver.$('android.widget.EditText');
    await inp.setValue('999999');

    // Click search
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();

    // Wait dynamically for manual entry form to appear by looking for the Save button
    const saveBtn = await driver.$('android=new UiSelector().text("💾 Save & Log")');
    await saveBtn.waitForExist({ timeout: 15000, timeoutMsg: 'Expected manual entry form to load but it did not.' });

    const inputs = await driver.$$('android.widget.EditText');
    const offset = inputs.length === 5 ? 0 : 1;

    if (inputs.length >= 5) {
      await inputs[offset + 0].setValue('Custom Salad');
      await inputs[offset + 1].setValue('150');
      await inputs[offset + 2].setValue('5');
      await inputs[offset + 3].setValue('12');
      await inputs[offset + 4].setValue('8');
    } else {
      throw new Error(`Expected at least 5 inputs, but found ${inputs.length}`);
    }
    await driver.pause(500);

    // Click Save & Log button
    await saveBtn.click();
    await driver.pause(1500); // Wait for save operation

    // Navigate to Today screen
    await clickTab(driver, 'today');

    // Verify it is logged
    const logItem = await findByText(driver, 'Custom Salad');
    await logItem.waitForExist({ timeout: 5000 });
    let pass = await logItem.isDisplayed();

    // Clean up
    const delBtns = await driver.$$('~Delete');
    if (delBtns.length > 0) {
      await delBtns[0].click();
      await driver.pause(500);
    }

    push('Manually Log Food Item Adds to Log', pass, Date.now() - t0, pass ? 'Successfully logged and verified manual entry: Custom Salad' : 'Manual entry not found in Today screen');
  } catch (e) {
    push('Manually Log Food Item Adds to Log', false, Date.now() - t0, e.message);
  }

  return results;
};
