/**
 * TEST 09 — Scan Mode
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Scan Mode',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to scan screen
    await clickTab(driver, 'scan');

    // Find and click "Start Camera Scanner" button
    const cameraBtn = await findByText(driver, '📷 Start Camera Scanner');
    await cameraBtn.waitForExist({ timeout: 5000 });
    await cameraBtn.click();
    await driver.pause(2000); // Wait for camera initialization

    // Check if camera is active by looking for "✕ Close Camera" button
    const closeBtn = await findByText(driver, '✕ Close Camera');
    await closeBtn.waitForExist({ timeout: 5000 });
    let pass = await closeBtn.isDisplayed();

    // Close camera scanner to return to default state
    await closeBtn.click();
    await driver.pause(1000);

    // Verify "Start Camera Scanner" button is visible again
    const cameraBtnAfter = await findByText(driver, '📷 Start Camera Scanner');
    pass = pass && await cameraBtnAfter.isDisplayed();

    push('Start Camera Scanner Activates Camera Preview', pass, Date.now() - t0, pass ? 'Camera preview toggled on and off successfully' : 'Camera preview failed to activate or close');
  } catch (e) {
    push('Start Camera Scanner Activates Camera Preview', false, Date.now() - t0, e.message);
  }

  return results;
};
