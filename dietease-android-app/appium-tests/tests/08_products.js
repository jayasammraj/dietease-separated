/**
 * TEST 08 — Products (25 test cases)
 * Uses only products in the current built-in DB.
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function searchProduct(driver, term) {
  await clickTab(driver, 'products');
  const searchInp = await driver.$('android.widget.EditText');
  await searchInp.waitForExist({ timeout: 5000 });
  await searchInp.clearValue();
  await searchInp.setValue(term);
  await driver.pause(2000);
}

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

  // ── Test 1: Products Tab accessible ─────────────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    await searchInp.waitForExist({ timeout: 5000 });
    push('Products Tab Search Input Exists', await searchInp.isDisplayed(), Date.now() - t, 'Search input is displayed');
  } catch (e) { push('Products Tab Search Input Exists', false, Date.now() - t, e.message); }

  // ── Test 2: Search 'Amul' returns 'Amul Butter' ──────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Amul');
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Search Amul Finds Amul Butter', await item.isDisplayed(), Date.now() - t, 'Amul Butter found in list');
  } catch (e) { push('Search Amul Finds Amul Butter', false, Date.now() - t, e.message); }

  // ── Test 3: Search 'Parle' returns 'Parle-G Biscuits' ────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Parle');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.waitForExist({ timeout: 5000 });
    push('Search Parle Finds Parle-G Biscuits', await item.isDisplayed(), Date.now() - t, 'Parle-G found in list');
  } catch (e) { push('Search Parle Finds Parle-G Biscuits', false, Date.now() - t, e.message); }

  // ── Test 4: Search 'Cadbury' returns 'Cadbury Dairy Milk' ────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Cadbury');
    const item = await findByText(driver, 'Cadbury Dairy Milk');
    await item.waitForExist({ timeout: 5000 });
    push('Search Cadbury Finds Cadbury Dairy Milk', await item.isDisplayed(), Date.now() - t, 'Cadbury Dairy Milk found');
  } catch (e) { push('Search Cadbury Finds Cadbury Dairy Milk', false, Date.now() - t, e.message); }

  // ── Test 5: Search 'Kellogg' returns 'Kellogg\'s Cornflakes' ─────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Kellogg');
    const item = await findByTextContains(driver, "Kellogg");
    await item.waitForExist({ timeout: 5000 });
    push("Search Kellogg Finds Kellogg's Product", await item.isDisplayed(), Date.now() - t, "Kellogg's product found");
  } catch (e) { push("Search Kellogg Finds Kellogg's Product", false, Date.now() - t, e.message); }

  // ── Test 6: Search 'Oreo' returns 'Oreo Cookies' ────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Oreo');
    const item = await findByText(driver, 'Oreo Cookies');
    await item.waitForExist({ timeout: 5000 });
    push('Search Oreo Finds Oreo Cookies', await item.isDisplayed(), Date.now() - t, 'Oreo Cookies found');
  } catch (e) { push('Search Oreo Finds Oreo Cookies', false, Date.now() - t, e.message); }

  // ── Test 7: Search 'Pepsi' returns 'Pepsi 250ml' ─────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Pepsi');
    const item = await findByText(driver, 'Pepsi 250ml');
    await item.waitForExist({ timeout: 5000 });
    push('Search Pepsi Finds Pepsi 250ml', await item.isDisplayed(), Date.now() - t, 'Pepsi 250ml found');
  } catch (e) { push('Search Pepsi Finds Pepsi 250ml', false, Date.now() - t, e.message); }

  // ── Test 8: Search 'KitKat' returns 'KitKat 4 Finger' ───────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'KitKat');
    const item = await findByText(driver, 'KitKat 4 Finger');
    await item.waitForExist({ timeout: 5000 });
    push('Search KitKat Finds KitKat 4 Finger', await item.isDisplayed(), Date.now() - t, 'KitKat 4 Finger found');
  } catch (e) { push('Search KitKat Finds KitKat 4 Finger', false, Date.now() - t, e.message); }

  // ── Test 9: Clear search input returns all products ─────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    await searchInp.clearValue();
    await driver.pause(1000);
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Clear Search Restores Full Product List', await item.isDisplayed(), Date.now() - t, 'Amul Butter is visible in list');
  } catch (e) { push('Clear Search Restores Full Product List', false, Date.now() - t, e.message); }

  // ── Test 10: Non-matching search shows empty list ──────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'NonexistentXYZ');
    const item = await findByText(driver, 'Amul Butter');
    const exists = await item.isExisting();
    push('Non-matching Search Result Is Empty', !exists, Date.now() - t, !exists ? 'List does not show Amul Butter' : 'Stale item still shown');
  } catch (e) { push('Non-matching Search Result Is Empty', false, Date.now() - t, e.message); }

  // ── Test 11: Products list scroll does not crash app ─────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const { width, height } = await driver.getWindowSize();
    await driver.action('pointer', {
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', x: width / 2, y: height * 0.7 },
        { type: 'pointerDown' },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', x: width / 2, y: height * 0.3 },
        { type: 'pointerUp' }
      ]
    });
    await driver.pause(500);
    push('Products List Scroll Success', true, Date.now() - t, 'Products list scrolled successfully');
  } catch (e) { push('Products List Scroll Success', false, Date.now() - t, e.message); }

  // ── Test 12: Select product Amul Butter opens scan card ──────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Amul');
    const item = await findByText(driver, 'Amul Butter');
    await item.click();
    await driver.pause(2000);
    const cardTitle = await findByText(driver, 'Amul Butter');
    await cardTitle.waitForExist({ timeout: 5000 });
    const pass = await cardTitle.isDisplayed();
    const closeBtn = await driver.$('~Close');
    if (await closeBtn.isExisting()) { await closeBtn.click(); await driver.pause(500); }
    push('Click Product Card Navigates to Scan and Opens Detail', pass, Date.now() - t, pass ? 'Detail card opened' : 'Card not opened');
  } catch (e) { push('Click Product Card Navigates to Scan and Opens Detail', false, Date.now() - t, e.message); }

  // ── Test 13: Select Parle-G from list opens scan card ───────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Parle');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.click();
    await driver.pause(2000);
    const cardTitle = await findByText(driver, 'Parle-G Biscuits');
    await cardTitle.waitForExist({ timeout: 5000 });
    const pass = await cardTitle.isDisplayed();
    const closeBtn = await driver.$('~Close');
    if (await closeBtn.isExisting()) { await closeBtn.click(); await driver.pause(500); }
    push('Click Parle-G Navigates to Scan and Opens Detail', pass, Date.now() - t, pass ? 'Detail card opened' : 'Card not opened');
  } catch (e) { push('Click Parle-G Navigates to Scan and Opens Detail', false, Date.now() - t, e.message); }

  // ── Test 14: Search case insensitivity ('amul') ──────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'amul');
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Search Is Case Insensitive', await item.isDisplayed(), Date.now() - t, 'Found Amul Butter with lowercase input');
  } catch (e) { push('Search Is Case Insensitive', false, Date.now() - t, e.message); }

  // ── Test 15: Search 'Britannia' finds 'Britannia Good Day' ───────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Britannia');
    const item = await findByText(driver, 'Britannia Good Day');
    await item.waitForExist({ timeout: 5000 });
    push('Search Britannia Finds Britannia Good Day', await item.isDisplayed(), Date.now() - t, 'Britannia Good Day found');
  } catch (e) { push('Search Britannia Finds Britannia Good Day', false, Date.now() - t, e.message); }

  // ── Test 16: Search 'Sunfeast' finds 'Sunfeast Dark Fantasy' ─────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Sunfeast');
    const item = await findByText(driver, 'Sunfeast Dark Fantasy');
    await item.waitForExist({ timeout: 5000 });
    push('Search Sunfeast Finds Sunfeast Dark Fantasy', await item.isDisplayed(), Date.now() - t, 'Sunfeast Dark Fantasy found');
  } catch (e) { push('Search Sunfeast Finds Sunfeast Dark Fantasy', false, Date.now() - t, e.message); }

  // ── Test 17: Search 'Coca-Cola' finds 'Coca-Cola 250ml' ──────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Coca');
    const item = await findByTextContains(driver, 'Coca-Cola');
    await item.waitForExist({ timeout: 5000 });
    push('Search Coca Finds Coca-Cola Product', await item.isDisplayed(), Date.now() - t, 'Coca-Cola product found');
  } catch (e) { push('Search Coca Finds Coca-Cola Product', false, Date.now() - t, e.message); }

  // ── Test 18: Search '5 Star' finds Cadbury 5 Star ────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, '5 Star');
    const item = await findByText(driver, 'Cadbury 5 Star');
    await item.waitForExist({ timeout: 5000 });
    push('Search 5 Star Finds Cadbury 5 Star', await item.isDisplayed(), Date.now() - t, 'Cadbury 5 Star found');
  } catch (e) { push('Search 5 Star Finds Cadbury 5 Star', false, Date.now() - t, e.message); }

  // ── Test 19: Search 'ITC' finds Sunfeast Dark Fantasy ────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'ITC');
    const item = await findByText(driver, 'Sunfeast Dark Fantasy');
    await item.waitForExist({ timeout: 5000 });
    push('Search ITC Brand Finds Sunfeast Dark Fantasy', await item.isDisplayed(), Date.now() - t, 'ITC brand search works');
  } catch (e) { push('Search ITC Brand Finds Sunfeast Dark Fantasy', false, Date.now() - t, e.message); }

  // ── Test 20: Search 'Gold' finds Parle-G Gold ────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Gold');
    const item = await findByText(driver, 'Parle-G Gold');
    await item.waitForExist({ timeout: 5000 });
    push('Search Gold Finds Parle-G Gold', await item.isDisplayed(), Date.now() - t, 'Parle-G Gold found');
  } catch (e) { push('Search Gold Finds Parle-G Gold', false, Date.now() - t, e.message); }

  // ── Test 21: Search 'Nestlé' or 'Nestle' finds KitKat ───────────────────
  t = Date.now();
  try {
    await searchProduct(driver, 'Nestle');
    const item = await findByText(driver, 'KitKat 4 Finger');
    await item.waitForExist({ timeout: 5000 });
    push('Search Nestle Finds KitKat 4 Finger', await item.isDisplayed(), Date.now() - t, 'KitKat found via Nestle brand search');
  } catch (e) { push('Search Nestle Finds KitKat 4 Finger', false, Date.now() - t, e.message); }

  // ── Test 22: Search with whitespace trim works ────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, '   Amul   ');
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    push('Search Trims Leading And Trailing Whitespace', await item.isDisplayed(), Date.now() - t, 'Amul Butter found');
  } catch (e) { push('Search Trims Leading And Trailing Whitespace', false, Date.now() - t, e.message); }

  // ── Test 23: Navigate away and back retains search functionality ─────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    push('Search Input Accessible After Tab Switch', await searchInp.isDisplayed(), Date.now() - t, 'Search input responsive');
  } catch (e) { push('Search Input Accessible After Tab Switch', false, Date.now() - t, e.message); }

  // ── Test 24: Search by barcode ───────────────────────────────────────────
  t = Date.now();
  try {
    await searchProduct(driver, '8901719100018');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.waitForExist({ timeout: 5000 });
    push('Search by Barcode String Finds Product', await item.isDisplayed(), Date.now() - t, 'Parle-G found by barcode search');
  } catch (e) { push('Search by Barcode String Finds Product', false, Date.now() - t, e.message); }

  // ── Test 25: Clear search to cleanup ─────────────────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    await searchInp.clearValue();
    await driver.pause(1000);
    push('Clear Search input successfully', true, Date.now() - t, 'Cleaned search term');
  } catch (e) { push('Clear Search input successfully', false, Date.now() - t, e.message); }

  return results;
};
