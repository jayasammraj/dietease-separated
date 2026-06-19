/**
 * TEST 07 — History (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function logFood(driver, barcode) {
  await clickTab(driver, 'scan');
  const inp = await driver.$('android.widget.EditText');
  await inp.waitForExist({ timeout: 5000 });
  await inp.clearValue();
  await inp.setValue(barcode);
  const searchBtn = await driver.$('~Search');
  await searchBtn.click();
  await driver.pause(3000);
  const logBtn = await driver.$('android=new UiSelector().textContains("Log This Food")');
  await logBtn.waitForExist({ timeout: 10000 });
  await logBtn.click();
  await driver.pause(1500);
}

async function clearAll(driver) {
  await clickTab(driver, 'today');
  let btns = await driver.$$('~Delete');
  while (btns.length > 0) {
    await btns[0].click();
    await driver.pause(600);
    btns = await driver.$$('~Delete');
  }
}

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

  // ── Test 1: History Tab is accessible ───────────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'history');
    const histHeader = await driver.$('android=new UiSelector().text("History")');
    await histHeader.waitForExist({ timeout: 5000 });
    push('History Tab Header Visible', await histHeader.isDisplayed(), Date.now() - t, 'History header visible');
  } catch (e) { push('History Tab Header Visible', false, Date.now() - t, e.message); }

  // ── Test 2: Log item, go to History, verify Today is listed ───────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.waitForExist({ timeout: 5000 });
    push('History Sidebar Lists Today Option', await todayLabel.isDisplayed(), Date.now() - t, 'Today visible in sidebar');
  } catch (e) { push('History Sidebar Lists Today Option', false, Date.now() - t, e.message); }

  // ── Test 3: Click Today, verify Parle-G is in details list ─────────────────
  t = Date.now();
  try {
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await driver.pause(1000);
    const detail = await findByText(driver, 'Parle-G Biscuits');
    await detail.waitForExist({ timeout: 5000 });
    push('History Details Show Logged Parle-G Biscuits', await detail.isDisplayed(), Date.now() - t, 'Logged item found');
  } catch (e) { push('History Details Show Logged Parle-G Biscuits', false, Date.now() - t, e.message); }

  // ── Test 4: History list scroll does not crash ───────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const { width, height } = await driver.getWindowSize();
    await driver.action('pointer', {
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', x: width / 4, y: height * 0.7 },
        { type: 'pointerDown' },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', x: width / 4, y: height * 0.3 },
        { type: 'pointerUp' }
      ]
    });
    await driver.pause(500);
    push('History Sidebar Scroll Success', true, Date.now() - t, 'Sidebar scroll ok');
  } catch (e) { push('History Sidebar Scroll Success', false, Date.now() - t, e.message); }

  // ── Test 5: Details panel scroll does not crash ──────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const { width, height } = await driver.getWindowSize();
    await driver.action('pointer', {
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', x: width * 3 / 4, y: height * 0.7 },
        { type: 'pointerDown' },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', x: width * 3 / 4, y: height * 0.3 },
        { type: 'pointerUp' }
      ]
    });
    await driver.pause(500);
    push('History Details Scroll Success', true, Date.now() - t, 'Details scroll ok');
  } catch (e) { push('History Details Scroll Success', false, Date.now() - t, e.message); }

  // ── Test 6: Verify History detail card shows calories ───────────────────
  t = Date.now();
  try {
    const calEl = await findByTextContains(driver, 'kcal');
    push('History Detail Displays Calories', await calEl.isDisplayed(), Date.now() - t, 'Calories found in details');
  } catch (e) { push('History Detail Displays Calories', false, Date.now() - t, e.message); }

  // ── Test 7: Verify History detail card shows protein ────────────────────
  t = Date.now();
  try {
    const protEl = await findByTextContains(driver, 'Protein');
    push('History Detail Displays Protein Field', await protEl.isDisplayed(), Date.now() - t, 'Protein label found in details');
  } catch (e) { push('History Detail Displays Protein Field', false, Date.now() - t, e.message); }

  // ── Test 8: Verify History detail card shows carbs ──────────────────────
  t = Date.now();
  try {
    const carbEl = await findByTextContains(driver, 'Carbs');
    push('History Detail Displays Carbs Field', await carbEl.isDisplayed(), Date.now() - t, 'Carbs label found in details');
  } catch (e) { push('History Detail Displays Carbs Field', false, Date.now() - t, e.message); }

  // ── Test 9: Verify History detail card shows fat ────────────────────────
  t = Date.now();
  try {
    const fatEl = await findByTextContains(driver, 'Fat');
    push('History Detail Displays Fat Field', await fatEl.isDisplayed(), Date.now() - t, 'Fat label found in details');
  } catch (e) { push('History Detail Displays Fat Field', false, Date.now() - t, e.message); }

  // ── Test 10: History view navigation to Today tab works ──────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const todayEl = await driver.$('android=new UiSelector().textContains("Today")');
    push('Navigate from History Back to Today Tab', await todayEl.isDisplayed(), Date.now() - t, 'Today tab active');
  } catch (e) { push('Navigate from History Back to Today Tab', false, Date.now() - t, e.message); }

  // ── Test 11: History view navigation to Scan tab works ───────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    push('Navigate from History Back to Scan Tab', await inp.isDisplayed(), Date.now() - t, 'Scan tab active');
  } catch (e) { push('Navigate from History Back to Scan Tab', false, Date.now() - t, e.message); }

  // ── Test 12: History view navigation to Products tab works ───────────────
  t = Date.now();
  try {
    await clickTab(driver, 'products');
    const searchInp = await driver.$('android.widget.EditText');
    push('Navigate from History Back to Products Tab', await searchInp.isDisplayed(), Date.now() - t, 'Products tab active');
  } catch (e) { push('Navigate from History Back to Products Tab', false, Date.now() - t, e.message); }

  // ── Test 13: History details show second logged item ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901088002230'); // Amul Butter
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await driver.pause(1000);
    const detail = await findByText(driver, 'Amul Butter');
    await detail.waitForExist({ timeout: 5000 });
    push('History Details Show Logged Amul Butter', await detail.isDisplayed(), Date.now() - t, 'Amul Butter visible');
  } catch (e) { push('History Details Show Logged Amul Butter', false, Date.now() - t, e.message); }

  // ── Test 14: History details shows third logged item ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901499000018'); // Kellogg's Cornflakes
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await driver.pause(1000);
    const detail = await findByTextContains(driver, 'Cornflakes');
    await detail.waitForExist({ timeout: 5000 });
    push('History Details Show Logged Mock Apple', await detail.isDisplayed(), Date.now() - t, 'Cornflakes visible');
  } catch (e) { push('History Details Show Logged Mock Apple', false, Date.now() - t, e.message); }

  // ── Test 15: Empty history doesn't crash app ─────────────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await clickTab(driver, 'history');
    const historyHeader = await driver.$('android=new UiSelector().text("History")');
    push('Empty History Sidebar Stays Responsive', await historyHeader.isDisplayed(), Date.now() - t, 'App responsive');
  } catch (e) { push('Empty History Sidebar Stays Responsive', false, Date.now() - t, e.message); }

  // ── Test 16: Click arbitrary element in empty sidebar doesn't crash ───────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const header = await findByText(driver, 'History');
    await header.click();
    await driver.pause(500);
    push('Click History Header Does Not Crash', true, Date.now() - t, 'App did not crash');
  } catch (e) { push('Click History Header Does Not Crash', false, Date.now() - t, e.message); }

  // ── Test 17: Logged item brand text displays in history ──────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await driver.pause(1000);
    const brandText = await findByTextContains(driver, 'Parle');
    push('History Detail Displays Brand Name', await brandText.isDisplayed(), Date.now() - t, 'Parle brand text shown');
  } catch (e) { push('History Detail Displays Brand Name', false, Date.now() - t, e.message); }

  // ── Test 18: Today label in sidebar stays clickable ───────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await driver.pause(500);
    push('Today Sidebar Item Is Clickable', true, Date.now() - t, 'Click did not error');
  } catch (e) { push('Today Sidebar Item Is Clickable', false, Date.now() - t, e.message); }

  // ── Test 19: Check history macro values are positive ──────────────────────
  t = Date.now();
  try {
    const carbEl = await findByTextContains(driver, 'g');
    push('History Macros Use Correct Unit Labels', await carbEl.isDisplayed(), Date.now() - t, 'Gram labels displayed');
  } catch (e) { push('History Macros Use Correct Unit Labels', false, Date.now() - t, e.message); }

  // ── Test 20: Scroll history details rapid taps ───────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await todayLabel.click();
    await driver.pause(500);
    push('Double Tap Today Sidebar Item Responsiveness', true, Date.now() - t, 'App stays responsive');
  } catch (e) { push('Double Tap Today Sidebar Item Responsiveness', false, Date.now() - t, e.message); }

  // ── Test 21: Log Dairy Milk, verify in history details ───────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '7622210449283'); // Cadbury Dairy Milk
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await driver.pause(1000);
    const detail = await findByTextContains(driver, 'Dairy Milk');
    push('History Details Show Logged Mock Banana', await detail.isDisplayed(), Date.now() - t, 'Dairy Milk visible');
  } catch (e) { push('History Details Show Logged Mock Banana', false, Date.now() - t, e.message); }

  // ── Test 22: Log Coca-Cola 250ml, verify in history details ───────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901552004123'); // Coca-Cola 250ml
    await clickTab(driver, 'history');
    const todayLabel = await findByText(driver, 'Today');
    await todayLabel.click();
    await driver.pause(1000);
    const detail = await findByTextContains(driver, 'Coca-Cola');
    push('History Details Show Logged Mock Orange', await detail.isDisplayed(), Date.now() - t, 'Coca-Cola visible');
  } catch (e) { push('History Details Show Logged Mock Orange', false, Date.now() - t, e.message); }

  // ── Test 23: Verify History page layout contains sidebar indicator ────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const sidebar = await findByText(driver, 'Today');
    push('Sidebar Layout Indicator Present', await sidebar.isDisplayed(), Date.now() - t, 'Sidebar present');
  } catch (e) { push('Sidebar Layout Indicator Present', false, Date.now() - t, e.message); }

  // ── Test 24: History detail panel contains header text ────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    const headerText = await findByTextContains(driver, 'Logged Food');
    push('History Details Panel Header Visible', await headerText.isDisplayed(), Date.now() - t, 'Details panel title visible');
  } catch (e) { push('History Details Panel Header Visible', false, Date.now() - t, e.message); }

  // ── Test 25: Reset log cleanup ───────────────────────────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    push('Clear Log History Clean State Done', true, Date.now() - t, 'Database cleaned');
  } catch (e) { push('Clear Log History Clean State Done', false, Date.now() - t, e.message); }

  return results;
};
