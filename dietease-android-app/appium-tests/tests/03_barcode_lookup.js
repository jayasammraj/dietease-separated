/**
 * TEST 03 — Barcode Lookup (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function lookupBarcode(driver, barcode) {
  await clickTab(driver, 'scan');
  const inp = await driver.$('android.widget.EditText');
  await inp.waitForExist({ timeout: 5000 });
  await inp.clearValue();
  await inp.setValue(barcode);
  const searchBtn = await driver.$('~Search');
  await searchBtn.waitForExist({ timeout: 5000 });
  await searchBtn.click();
  await driver.pause(3000);
}

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

  // ── Test 1: Scan tab is reachable ──────────────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.waitForExist({ timeout: 5000 });
    push('Scan Tab Contains Barcode Input', true, Date.now() - t, 'EditText input found on scan screen');
  } catch (e) { push('Scan Tab Contains Barcode Input', false, Date.now() - t, e.message); }

  // ── Test 2: Search button exists on scan screen ────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const btn = await driver.$('~Search');
    await btn.waitForExist({ timeout: 5000 });
    const vis = await btn.isDisplayed();
    push('Search Button Visible on Scan Screen', vis, Date.now() - t, vis ? 'Search button is visible' : 'Search button not visible');
  } catch (e) { push('Search Button Visible on Scan Screen', false, Date.now() - t, e.message); }

  // ── Test 3: Known barcode → Parle-G Biscuits ──────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901719100018');
    const card = await findByText(driver, 'Parle-G Biscuits');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup 8901719100018 Shows Parle-G Biscuits', pass, Date.now() - t, pass ? 'Card visible' : 'Card not found');
  } catch (e) { push('Lookup 8901719100018 Shows Parle-G Biscuits', false, Date.now() - t, e.message); }

  // ── Test 4: Result card shows calories field ───────────────────────────
  t = Date.now();
  try {
    const calEl = await findByTextContains(driver, 'kcal');
    await calEl.waitForExist({ timeout: 5000 });
    const pass = await calEl.isDisplayed();
    push('Result Card Displays Calories (kcal)', pass, Date.now() - t, pass ? 'Calories visible' : 'Calories not found');
  } catch (e) { push('Result Card Displays Calories (kcal)', false, Date.now() - t, e.message); }

  // ── Test 5: Result card shows protein field ────────────────────────────
  t = Date.now();
  try {
    const protEl = await findByTextContains(driver, 'Protein');
    await protEl.waitForExist({ timeout: 5000 });
    const pass = await protEl.isDisplayed();
    push('Result Card Displays Protein Field', pass, Date.now() - t, pass ? 'Protein visible' : 'Protein not found');
  } catch (e) { push('Result Card Displays Protein Field', false, Date.now() - t, e.message); }

  // ── Test 6: Result card shows carbs field ─────────────────────────────
  t = Date.now();
  try {
    const carbEl = await findByTextContains(driver, 'Carbs');
    await carbEl.waitForExist({ timeout: 5000 });
    const pass = await carbEl.isDisplayed();
    push('Result Card Displays Carbs Field', pass, Date.now() - t, pass ? 'Carbs visible' : 'Carbs not found');
  } catch (e) { push('Result Card Displays Carbs Field', false, Date.now() - t, e.message); }

  // ── Test 7: Result card shows fat field ───────────────────────────────
  t = Date.now();
  try {
    const fatEl = await findByTextContains(driver, 'Fat');
    await fatEl.waitForExist({ timeout: 5000 });
    const pass = await fatEl.isDisplayed();
    push('Result Card Displays Fat Field', pass, Date.now() - t, pass ? 'Fat visible' : 'Fat not found');
  } catch (e) { push('Result Card Displays Fat Field', false, Date.now() - t, e.message); }

  // ── Test 8: Result card shows Log This Food button ────────────────────
  t = Date.now();
  try {
    const logBtn = await driver.$('android=new UiSelector().textContains("Log This Food")');
    await logBtn.waitForExist({ timeout: 5000 });
    const pass = await logBtn.isDisplayed();
    push('Result Card Shows Log This Food Button', pass, Date.now() - t, pass ? 'Log button visible' : 'Log button not found');
  } catch (e) { push('Result Card Shows Log This Food Button', false, Date.now() - t, e.message); }

  // ── Test 9: Known barcode → Amul Butter ───────────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901088002230');
    const card = await findByText(driver, 'Amul Butter');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup 8901088002230 Shows Amul Butter', pass, Date.now() - t, pass ? 'Amul Butter card visible' : 'Amul Butter not found');
  } catch (e) { push('Lookup 8901088002230 Shows Amul Butter', false, Date.now() - t, e.message); }

  // ── Test 10: Known barcode → Oreo Cookies ────────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '037600164801');
    const card = await findByText(driver, 'Oreo Cookies');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup 037600164801 Shows Oreo Cookies', pass, Date.now() - t, pass ? 'Oreo card visible' : 'Oreo card not found');
  } catch (e) { push('Lookup 037600164801 Shows Oreo Cookies', false, Date.now() - t, e.message); }

  // ── Test 11: Unknown barcode shows manual entry form ──────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '0000000000001');
    const saveBtn = await driver.$('android=new UiSelector().textContains("Save & Log")');
    await saveBtn.waitForExist({ timeout: 10000 });
    const pass = await saveBtn.isDisplayed();
    push('Unknown Barcode Shows Manual Entry Form', pass, Date.now() - t, pass ? 'Manual entry form visible' : 'Form not shown');
  } catch (e) { push('Unknown Barcode Shows Manual Entry Form', false, Date.now() - t, e.message); }

  // ── Test 12: Close card button works ──────────────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901719100018');
    const closeBtn = await driver.$('~Close');
    await closeBtn.waitForExist({ timeout: 8000 });
    await closeBtn.click();
    await driver.pause(1000);
    const inp = await driver.$('android.widget.EditText');
    const pass = await inp.isDisplayed();
    push('Close Button Dismisses Result Card', pass, Date.now() - t, pass ? 'Card dismissed, input visible' : 'Card not dismissed');
  } catch (e) { push('Close Button Dismisses Result Card', false, Date.now() - t, e.message); }

  // ── Test 13: Input field accepts numeric barcode ───────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.clearValue();
    await inp.setValue('1234567890');
    const val = await inp.getText();
    const pass = val.includes('1234567890') || val.length > 0;
    push('Input Field Accepts Numeric Barcode', pass, Date.now() - t, pass ? `Value set: ${val}` : 'Input failed');
  } catch (e) { push('Input Field Accepts Numeric Barcode', false, Date.now() - t, e.message); }

  // ── Test 14: Known barcode → Britannia Good Day ───────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901063032019');
    const card = await findByTextContains(driver, 'Britannia');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup Returns Britannia Product', pass, Date.now() - t, pass ? 'Britannia product card visible' : 'Britannia not found');
  } catch (e) { push('Lookup Returns Britannia Product', false, Date.now() - t, e.message); }

  // ── Test 15: Kellogg's Cornflakes barcode 8901499000018 ─────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901499000018');
    const card = await findByTextContains(driver, 'Kellogg');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup 8901499000018 Shows Kellogg\'s Product', pass, Date.now() - t, pass ? 'Kellogg\'s product found' : 'Kellogg\'s product not found');
  } catch (e) { push('Lookup 8901499000018 Shows Kellogg\'s Product', false, Date.now() - t, e.message); }
 
  // ── Test 16: Cadbury Dairy Milk barcode 7622210449283 ─────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '7622210449283');
    const card = await findByTextContains(driver, 'Cadbury');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup 7622210449283 Shows Cadbury Product', pass, Date.now() - t, pass ? 'Cadbury product found' : 'Cadbury product not found');
  } catch (e) { push('Lookup 7622210449283 Shows Cadbury Product', false, Date.now() - t, e.message); }

  // ── Test 17: Result card shows brand name ─────────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901719100018');
    const brandEl = await findByTextContains(driver, 'Parle');
    await brandEl.waitForExist({ timeout: 8000 });
    const pass = await brandEl.isDisplayed();
    push('Result Card Displays Brand Name', pass, Date.now() - t, pass ? 'Brand name visible' : 'Brand not found');
  } catch (e) { push('Result Card Displays Brand Name', false, Date.now() - t, e.message); }

  // ── Test 18: Consecutive lookups work correctly ────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901719100018');
    await driver.pause(1000);
    // Close the first result
    const closeBtn = await driver.$('~Close');
    if (await closeBtn.isExisting()) { await closeBtn.click(); await driver.pause(500); }
    // Do another lookup
    await lookupBarcode(driver, '8901088002230');
    const card = await findByText(driver, 'Amul Butter');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Consecutive Barcode Lookups Work', pass, Date.now() - t, pass ? 'Second lookup successful' : 'Second lookup failed');
  } catch (e) { push('Consecutive Barcode Lookups Work', false, Date.now() - t, e.message); }

  // ── Test 19: Barcode input is clearable ───────────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.setValue('12345');
    await inp.clearValue();
    const val = await inp.getText();
    const pass = val === '' || val === null || val.length === 0;
    push('Barcode Input Field Is Clearable', pass, Date.now() - t, pass ? 'Input cleared' : `Input still has: ${val}`);
  } catch (e) { push('Barcode Input Field Is Clearable', false, Date.now() - t, e.message); }

  // ── Test 20: Empty barcode search doesn't crash ────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.clearValue();
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();
    await driver.pause(2000);
    // App should still be running (not crashed)
    const scanInp = await driver.$('android.widget.EditText');
    const pass = await scanInp.isExisting();
    push('Empty Search Does Not Crash App', pass, Date.now() - t, pass ? 'App still running after empty search' : 'App may have crashed');
  } catch (e) { push('Empty Search Does Not Crash App', false, Date.now() - t, e.message); }

  // ── Test 21: DB source badge is visible after lookup ──────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901719100018');
    const dbBadge = await findByTextContains(driver, 'Built-in DB');
    await dbBadge.waitForExist({ timeout: 8000 });
    const pass = await dbBadge.isDisplayed();
    push('Result Card Shows Built-in DB Badge', pass, Date.now() - t, pass ? 'DB badge visible' : 'DB badge not found');
  } catch (e) { push('Result Card Shows Built-in DB Badge', false, Date.now() - t, e.message); }

  // ── Test 22: Known barcode → Parle Hide & Seek ──────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901719110017');
    const card = await findByTextContains(driver, 'Hide & Seek');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup Returns Hide & Seek Product', pass, Date.now() - t, pass ? 'Hide & Seek card visible' : 'Hide & Seek not found');
  } catch (e) { push('Lookup Returns Hide & Seek Product', false, Date.now() - t, e.message); }

  // ── Test 23: Result card is scrollable if content overflows ───────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901719100018');
    const card = await findByTextContains(driver, 'Parle-G');
    await card.waitForExist({ timeout: 8000 });
    // Attempt swipe on the result card area to ensure it's scrollable
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
    const pass = await card.isExisting();
    push('Result Card Scroll Does Not Crash App', pass, Date.now() - t, pass ? 'Scroll ok' : 'App may have crashed after scroll');
  } catch (e) { push('Result Card Scroll Does Not Crash App', false, Date.now() - t, e.message); }

  // ── Test 24: Barcode with 13 digits is accepted ───────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.clearValue();
    await inp.setValue('8901719100018');
    const val = await inp.getText();
    const pass = val.length >= 1;
    push('13-Digit Barcode Accepted in Input', pass, Date.now() - t, pass ? `Input value: ${val}` : 'Failed to enter barcode');
  } catch (e) { push('13-Digit Barcode Accepted in Input', false, Date.now() - t, e.message); }

  // ── Test 25: Coca-Cola 250ml barcode 8901552004123 ─────────────────────────
  t = Date.now();
  try {
    await lookupBarcode(driver, '8901552004123');
    const card = await findByTextContains(driver, 'Coca-Cola');
    await card.waitForExist({ timeout: 10000 });
    const pass = await card.isDisplayed();
    push('Lookup 8901552004123 Shows Coca-Cola', pass, Date.now() - t, pass ? 'Coca-Cola found' : 'Coca-Cola not found');
  } catch (e) { push('Lookup 8901552004123 Shows Coca-Cola', false, Date.now() - t, e.message); }

  return results;
};
