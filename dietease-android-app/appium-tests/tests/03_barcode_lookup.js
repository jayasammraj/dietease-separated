/**
 * TEST 03 — Barcode Lookup
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Barcode Lookup',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to scan screen
    await clickTab(driver, 'scan');

    // Find barcode input field (there's only one EditText on the scan screen)
    const inp = await driver.$('android.widget.EditText');
    await inp.waitForExist({ timeout: 5000 });
    await inp.setValue('8901719100018');

    // Click search icon button (contentDescription="Search")
    const searchBtn = await driver.$('~Search');
    await searchBtn.waitForExist({ timeout: 5000 });
    await searchBtn.click();

    // Verify lookup result card displays correct product name
    const resultCardTitle = await findByText(driver, 'Parle-G Biscuits');
    await resultCardTitle.waitForExist({ timeout: 10000 });
    const pass = await resultCardTitle.isDisplayed();

    push('Barcode Lookup Displays Result Card', pass, Date.now() - t0, pass ? 'Parle-G Biscuits card visible' : 'Product name not found on card');
  } catch (e) {
    push('Barcode Lookup Displays Result Card', false, Date.now() - t0, e.message);
  }

  return results;
};
