/**
 * TEST 11 — UI & Styling
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'UI & Styling',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to scan screen
    await clickTab(driver, 'scan');

    // Check application branding text
    const title = await findByText(driver, 'DietEase+');
    const hasTitle = await title.isDisplayed();

    // Check scanner badge
    const badge = await findByText(driver, 'BARCODE SCANNER');
    const hasBadge = await badge.isDisplayed();

    // Check database source badges
    const dbTag = await findByText(driver, '⚡ Built-in DB');
    const hasDbTag = await dbTag.isDisplayed();

    const pass = hasTitle && hasBadge && hasDbTag;
    push('Verify Branding and Styling Elements', pass, Date.now() - t0, pass ? 'Branding title, scanner badge, and DB tag are visible' : 'Some UI components failed to display');
  } catch (e) {
    push('Verify Branding and Styling Elements', false, Date.now() - t0, e.message);
  }

  return results;
};
