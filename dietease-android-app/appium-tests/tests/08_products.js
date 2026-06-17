/**
 * TEST 08 — Products
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Products',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to products screen
    await clickTab(driver, 'products');

    // Find search input field
    const searchInp = await driver.$('android.widget.EditText');
    await searchInp.setValue('Amul');
    await driver.pause(1500);

    // Verify search results contain Amul Butter
    const productItem = await findByText(driver, 'Amul Butter');
    await productItem.waitForExist({ timeout: 5000 });

    // Click the item (triggers navigation to scan screen with item loaded)
    await productItem.click();
    await driver.pause(2000);

    // Verify we navigated back to Scan screen and the result card displays "Amul Butter"
    const cardTitle = await findByText(driver, 'Amul Butter');
    const pass = await cardTitle.isDisplayed();

    // Close the card
    const closeBtn = await driver.$('~Close');
    if (await closeBtn.isExisting()) {
      await closeBtn.click();
      await driver.pause(500);
    }

    push('Product Database Search and Selection', pass, Date.now() - t0, pass ? 'Successfully searched and selected Amul Butter' : 'Product selection failed to load card');
  } catch (e) {
    push('Product Database Search and Selection', false, Date.now() - t0, e.message);
  }

  return results;
};
