/**
 * TEST 01 — Page Load
 */
const { navigateTo, findByText, findByTextContains } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Page Load',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate (resets/restarts app)
    await navigateTo(driver);
    await driver.pause(1000);

    // Verify main header
    const headerEl = await findByText(driver, 'DietEase+');
    const hasHeader = await headerEl.isDisplayed();

    // Verify BARCODE SCANNER badge or Camera button
    const scannerBadge = await findByText(driver, 'BARCODE SCANNER');
    const hasBadge = await scannerBadge.isDisplayed();

    const pass = hasHeader && hasBadge;
    push('Main App Screen Loads Correctly', pass, Date.now() - t0, pass ? 'Header and Badge are visible' : 'Header or Badge not found');
  } catch (e) {
    push('Main App Screen Loads Correctly', false, Date.now() - t0, e.message);
  }

  return results;
};
