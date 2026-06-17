/**
 * TEST 02 — Navigation
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Navigation',
    error: info,
    timestamp: Date.now()
  });

  // T1 — Today Screen Navigation
  let t0 = Date.now();
  try {
    await clickTab(driver, 'today');
    const header = await findByText(driver, '📅 Today');
    const pass = await header.isDisplayed();
    push('Navigate to Today Screen', pass, Date.now() - t0, pass ? 'Today tab loaded' : 'Today header not found');
  } catch (e) {
    push('Navigate to Today Screen', false, Date.now() - t0, e.message);
  }

  // T2 — History Screen Navigation
  t0 = Date.now();
  try {
    await clickTab(driver, 'history');
    const header = await findByText(driver, '📅 History');
    const pass = await header.isDisplayed();
    push('Navigate to History Screen', pass, Date.now() - t0, pass ? 'History tab loaded' : 'History header not found');
  } catch (e) {
    push('Navigate to History Screen', false, Date.now() - t0, e.message);
  }

  // T3 — Products Screen Navigation
  t0 = Date.now();
  try {
    await clickTab(driver, 'products');
    const header = await findByText(driver, '🛒 Product Database');
    const pass = await header.isDisplayed();
    push('Navigate to Products Screen', pass, Date.now() - t0, pass ? 'Products tab loaded' : 'Products header not found');
  } catch (e) {
    push('Navigate to Products Screen', false, Date.now() - t0, e.message);
  }

  // T4 — Scan Screen Navigation
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan');
    const header = await findByText(driver, 'DietEase+');
    const pass = await header.isDisplayed();
    push('Navigate back to Scan Screen', pass, Date.now() - t0, pass ? 'Scan tab loaded' : 'Scan header not found');
  } catch (e) {
    push('Navigate back to Scan Screen', false, Date.now() - t0, e.message);
  }

  return results;
};
