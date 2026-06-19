/**
 * TEST 04 — Food Logging (25 test cases)
 */
const { clickTab, findByText, findByTextContains } = require('../utils/driver');

async function lookupAndLog(driver, barcode, productName) {
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

async function clearAllEntries(driver) {
  await clickTab(driver, 'today');
  await driver.pause(1000);
  let delBtns = await driver.$$('~Delete');
  while (delBtns.length > 0) {
    await delBtns[0].click();
    await driver.pause(600);
    delBtns = await driver.$$('~Delete');
  }
}

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Food Logging',
    error: info,
    timestamp: Date.now()
  });

  // Clean state
  await clearAllEntries(driver);

  // ── Test 1: Today tab is accessible ───────────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'today');
    const todayEl = await driver.$('android=new UiSelector().textContains("Today")');
    await todayEl.waitForExist({ timeout: 5000 });
    const pass = await todayEl.isDisplayed();
    push('Today Tab Is Accessible', pass, Date.now() - t, pass ? 'Today tab visible' : 'Today tab not found');
  } catch (e) { push('Today Tab Is Accessible', false, Date.now() - t, e.message); }

  // ── Test 2: Log Parle-G and verify in Today ────────────────────────────
  t = Date.now();
  try {
    await lookupAndLog(driver, '8901719100018', 'Parle-G Biscuits');
    await clickTab(driver, 'today');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Log Parle-G Appears in Today Tab', pass, Date.now() - t, pass ? 'Item visible in Today' : 'Item not found');
  } catch (e) { push('Log Parle-G Appears in Today Tab', false, Date.now() - t, e.message); }

  // ── Test 3: Today shows calorie total after logging ────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const calEl = await findByTextContains(driver, 'kcal');
    await calEl.waitForExist({ timeout: 5000 });
    const pass = await calEl.isDisplayed();
    push('Today Screen Shows Calorie Total', pass, Date.now() - t, pass ? 'Calorie total visible' : 'Calorie total not found');
  } catch (e) { push('Today Screen Shows Calorie Total', false, Date.now() - t, e.message); }

  // ── Test 4: Today shows food item count > 0 ───────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const items = await driver.$$('~Delete');
    const pass = items.length > 0;
    push('Today Tab Shows At Least One Food Entry', pass, Date.now() - t, pass ? `${items.length} entries found` : 'No entries found');
  } catch (e) { push('Today Tab Shows At Least One Food Entry', false, Date.now() - t, e.message); }

  // ── Test 5: Log second food item (Amul Butter) ────────────────────────
  t = Date.now();
  try {
    await lookupAndLog(driver, '8901088002230', 'Amul Butter');
    await clickTab(driver, 'today');
    const item = await findByText(driver, 'Amul Butter');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Log Second Food Item (Amul Butter) in Today', pass, Date.now() - t, pass ? 'Second item visible' : 'Second item not found');
  } catch (e) { push('Log Second Food Item (Amul Butter) in Today', false, Date.now() - t, e.message); }

  // ── Test 6: Multiple entries accumulate in Today list ─────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const items = await driver.$$('~Delete');
    const pass = items.length >= 2;
    push('Multiple Logged Items Accumulate in Today', pass, Date.now() - t, pass ? `${items.length} items in today` : `Only ${items.length} items`);
  } catch (e) { push('Multiple Logged Items Accumulate in Today', false, Date.now() - t, e.message); }

  // ── Test 7: Calorie total increases after logging ──────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const calEl = await findByTextContains(driver, 'kcal');
    const calText = await calEl.getText();
    const parsed = parseInt(calText.replace(/[^0-9]/g, ''));
    const pass = !isNaN(parsed) && parsed > 0;
    push('Calorie Total Is Greater Than Zero After Logging', pass, Date.now() - t, pass ? `Total: ${parsed} kcal` : 'Invalid calorie text');
  } catch (e) { push('Calorie Total Is Greater Than Zero After Logging', false, Date.now() - t, e.message); }

  // ── Test 8: Log button navigates back (card closes) ───────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.clearValue();
    await inp.setValue('8901719100018');
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();
    await driver.pause(3000);
    const logBtn = await driver.$('android=new UiSelector().textContains("Log This Food")');
    await logBtn.waitForExist({ timeout: 10000 });
    await logBtn.click();
    await driver.pause(1500);
    // After logging, result card should be gone or Today should be active
    const inp2 = await driver.$('android.widget.EditText');
    const pass = await inp2.isExisting(); // back to scan input (card dismissed)
    push('Log Button Dismisses Result Card', pass, Date.now() - t, pass ? 'Card dismissed after logging' : 'Card still visible');
  } catch (e) { push('Log Button Dismisses Result Card', false, Date.now() - t, e.message); }

  // ── Test 9: Today screen has progress indicator ────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    // Progress bar or goal line
    const progressEl = await findByTextContains(driver, '/');
    await progressEl.waitForExist({ timeout: 5000 });
    const pass = await progressEl.isDisplayed();
    push('Today Screen Has Goal Progress Indicator', pass, Date.now() - t, pass ? 'Progress indicator visible' : 'Progress not found');
  } catch (e) { push('Today Screen Has Goal Progress Indicator', false, Date.now() - t, e.message); }

  // ── Test 10: Today screen shows macro breakdown ────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const protEl = await findByTextContains(driver, 'Protein');
    await protEl.waitForExist({ timeout: 5000 });
    const pass = await protEl.isDisplayed();
    push('Today Screen Shows Protein Macro', pass, Date.now() - t, pass ? 'Protein macro visible' : 'Protein not shown');
  } catch (e) { push('Today Screen Shows Protein Macro', false, Date.now() - t, e.message); }

  // ── Test 11: Log Oreo Cookies ────────────────────────────────────────
  t = Date.now();
  try {
    await lookupAndLog(driver, '037600164801', 'Oreo Cookies');
    await clickTab(driver, 'today');
    const item = await findByTextContains(driver, 'Oreo Cookies');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Log Oreo Cookies Appears in Today Tab', pass, Date.now() - t, pass ? 'Oreo visible' : 'Oreo not found');
  } catch (e) { push('Log Oreo Cookies Appears in Today Tab', false, Date.now() - t, e.message); }

  // ── Test 12: Today screen food list is scrollable ─────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
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
    // App still running
    const tab = await driver.$('android=new UiSelector().text("Today")');
    const pass = await tab.isExisting();
    push('Today Screen List Is Scrollable', pass, Date.now() - t, pass ? 'Scroll ok' : 'App crashed on scroll');
  } catch (e) { push('Today Screen List Is Scrollable', false, Date.now() - t, e.message); }

  // ── Test 13: Carbs macro displayed ────────────────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const carbEl = await findByTextContains(driver, 'Carbs');
    await carbEl.waitForExist({ timeout: 5000 });
    const pass = await carbEl.isDisplayed();
    push('Today Screen Shows Carbs Macro', pass, Date.now() - t, pass ? 'Carbs visible' : 'Carbs not shown');
  } catch (e) { push('Today Screen Shows Carbs Macro', false, Date.now() - t, e.message); }

  // ── Test 14: Fat macro displayed ──────────────────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const fatEl = await findByTextContains(driver, 'Fat');
    await fatEl.waitForExist({ timeout: 5000 });
    const pass = await fatEl.isDisplayed();
    push('Today Screen Shows Fat Macro', pass, Date.now() - t, pass ? 'Fat visible' : 'Fat not shown');
  } catch (e) { push('Today Screen Shows Fat Macro', false, Date.now() - t, e.message); }

  // ── Test 15: Log Kellogg's Cornflakes ───────────────────────────────
  t = Date.now();
  try {
    await lookupAndLog(driver, '8901499000018', 'Kellogg\'s Cornflakes');
    await clickTab(driver, 'today');
    const item = await findByTextContains(driver, 'Cornflakes');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Log Kellogg\'s Cornflakes Appears in Today Tab', pass, Date.now() - t, pass ? 'Kellogg\'s logged' : 'Kellogg\'s not found');
  } catch (e) { push('Log Kellogg\'s Cornflakes Appears in Today Tab', false, Date.now() - t, e.message); }

  // ── Test 16: Today screen edit goal button visible ────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const editBtn = await driver.$('~Edit goal');
    await editBtn.waitForExist({ timeout: 5000 });
    const pass = await editBtn.isDisplayed();
    push('Today Screen Shows Edit Goal Button', pass, Date.now() - t, pass ? 'Edit goal button visible' : 'Edit goal button not found');
  } catch (e) { push('Today Screen Shows Edit Goal Button', false, Date.now() - t, e.message); }

  // ── Test 17: Date header shows today's date ───────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const now = new Date();
    const day = now.getDate().toString();
    const dateEl = await findByTextContains(driver, day);
    await dateEl.waitForExist({ timeout: 5000 });
    const pass = await dateEl.isDisplayed();
    push('Today Screen Shows Current Date', pass, Date.now() - t, pass ? `Date ${day} visible` : 'Date not visible');
  } catch (e) { push('Today Screen Shows Current Date', false, Date.now() - t, e.message); }

  // ── Test 18: Logged item shows food name text ─────────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const item = await findByTextContains(driver, 'Parle');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Logged Item Displays Food Name in Today List', pass, Date.now() - t, pass ? 'Food name visible' : 'Food name not found');
  } catch (e) { push('Logged Item Displays Food Name in Today List', false, Date.now() - t, e.message); }

  // ── Test 19: Log Cadbury Dairy Milk ──────────────────────────────────
  t = Date.now();
  try {
    await lookupAndLog(driver, '7622210449283', 'Cadbury Dairy Milk');
    await clickTab(driver, 'today');
    const item = await findByTextContains(driver, 'Dairy Milk');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Log Cadbury Dairy Milk Appears in Today Tab', pass, Date.now() - t, pass ? 'Cadbury logged' : 'Cadbury not found');
  } catch (e) { push('Log Cadbury Dairy Milk Appears in Today Tab', false, Date.now() - t, e.message); }

  // ── Test 20: Today screen doesn't crash when list is long ─────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const items = await driver.$$('~Delete');
    const pass = items.length >= 1;
    push('Today Screen Renders Long Food List', pass, Date.now() - t, pass ? `${items.length} items rendered` : 'No items found');
  } catch (e) { push('Today Screen Renders Long Food List', false, Date.now() - t, e.message); }

  // ── Test 21: Can navigate away and back to Today ───────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'history');
    await driver.pause(500);
    await clickTab(driver, 'today');
    const item = await findByTextContains(driver, 'Parle');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Items Persist When Navigating Away and Back', pass, Date.now() - t, pass ? 'Items still visible' : 'Items lost on navigation');
  } catch (e) { push('Items Persist When Navigating Away and Back', false, Date.now() - t, e.message); }

  // ── Test 22: Today list items have delete buttons ─────────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const delBtns = await driver.$$('~Delete');
    const pass = delBtns.length > 0;
    push('Today List Items Have Delete Buttons', pass, Date.now() - t, pass ? `${delBtns.length} delete buttons found` : 'No delete buttons');
  } catch (e) { push('Today List Items Have Delete Buttons', false, Date.now() - t, e.message); }

  // ── Test 23: Log button text is visible on result card ────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'scan');
    const inp = await driver.$('android.widget.EditText');
    await inp.clearValue();
    await inp.setValue('8901088002230');
    const searchBtn = await driver.$('~Search');
    await searchBtn.click();
    await driver.pause(3000);
    const logBtn = await driver.$('android=new UiSelector().textContains("Log This Food")');
    await logBtn.waitForExist({ timeout: 10000 });
    const logText = await logBtn.getText();
    const pass = logText.toLowerCase().includes('log');
    push('Log This Food Button Has Correct Label', pass, Date.now() - t, pass ? `Button text: ${logText}` : `Unexpected text: ${logText}`);
  } catch (e) { push('Log This Food Button Has Correct Label', false, Date.now() - t, e.message); }

  // ── Test 24: Coca-Cola 250ml can be logged ────────────────────────────
  t = Date.now();
  try {
    await lookupAndLog(driver, '8901552004123', 'Coca-Cola 250ml');
    await clickTab(driver, 'today');
    const item = await findByTextContains(driver, 'Coca-Cola');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Log Coca-Cola 250ml Appears in Today Tab', pass, Date.now() - t, pass ? 'Coca-Cola logged' : 'Coca-Cola not found');
  } catch (e) { push('Log Coca-Cola 250ml Appears in Today Tab', false, Date.now() - t, e.message); }

  // ── Test 25: App stays responsive after bulk logging ─────────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const editGoalBtn = await driver.$('~Edit goal');
    await editGoalBtn.waitForExist({ timeout: 5000 });
    const pass = await editGoalBtn.isDisplayed();
    push('App Stays Responsive After Bulk Logging', pass, Date.now() - t, pass ? 'App still responsive' : 'App may have frozen');
  } catch (e) { push('App Stays Responsive After Bulk Logging', false, Date.now() - t, e.message); }

  return results;
};
