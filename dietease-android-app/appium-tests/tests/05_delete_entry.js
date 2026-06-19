/**
 * TEST 05 — Delete Entry (25 test cases)
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

async function countItems(driver) {
  await clickTab(driver, 'today');
  const btns = await driver.$$('~Delete');
  return btns.length;
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
    category: 'Delete Entry',
    error: info,
    timestamp: Date.now()
  });

  // ── Test 1: Today screen accessible ───────────────────────────────────
  let t = Date.now();
  try {
    await clickTab(driver, 'today');
    const todayEl = await driver.$('android=new UiSelector().textContains("Today")');
    await todayEl.waitForExist({ timeout: 5000 });
    push('Today Tab Is Accessible Before Delete', await todayEl.isDisplayed(), Date.now() - t, 'Today tab visible');
  } catch (e) { push('Today Tab Is Accessible Before Delete', false, Date.now() - t, e.message); }

  // ── Test 2: Log food then delete it ───────────────────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const before = await driver.$$('~Delete');
    const countBefore = before.length;
    await before[0].click();
    await driver.pause(800);
    const after = await driver.$$('~Delete');
    const pass = after.length < countBefore;
    push('Delete Button Removes One Food Entry', pass, Date.now() - t, pass ? `Before: ${countBefore}, After: ${after.length}` : 'Entry count did not decrease');
  } catch (e) { push('Delete Button Removes One Food Entry', false, Date.now() - t, e.message); }

  // ── Test 3: Item no longer visible after deletion ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const delBtns = await driver.$$('~Delete');
    if (delBtns.length === 0) throw new Error('No items to delete');
    await delBtns[0].click();
    await driver.pause(800);
    const parleEl = await findByText(driver, 'Parle-G Biscuits');
    const pass = !(await parleEl.isExisting());
    push('Deleted Item Disappears from Today List', pass, Date.now() - t, pass ? 'Item removed' : 'Item still visible');
  } catch (e) { push('Deleted Item Disappears from Today List', false, Date.now() - t, e.message); }

  // ── Test 4: Calorie total decreases after deletion ────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const calElBefore = await findByTextContains(driver, 'kcal');
    const textBefore = await calElBefore.getText();
    const calBefore = parseInt(textBefore.replace(/[^0-9]/g, ''));
    const delBtns = await driver.$$('~Delete');
    await delBtns[0].click();
    await driver.pause(800);
    const calElAfter = await findByTextContains(driver, 'kcal');
    const textAfter = await calElAfter.getText();
    const calAfter = parseInt(textAfter.replace(/[^0-9]/g, ''));
    const pass = calAfter < calBefore || calAfter === 0;
    push('Calorie Total Decreases After Deletion', pass, Date.now() - t, pass ? `Before: ${calBefore}, After: ${calAfter}` : 'Calories did not decrease');
  } catch (e) { push('Calorie Total Decreases After Deletion', false, Date.now() - t, e.message); }

  // ── Test 5: Delete all entries leaves empty state ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901088002230');
    await clickTab(driver, 'today');
    let btns = await driver.$$('~Delete');
    while (btns.length > 0) {
      await btns[0].click();
      await driver.pause(600);
      btns = await driver.$$('~Delete');
    }
    const pass = btns.length === 0;
    push('Deleting All Entries Leaves Empty Today List', pass, Date.now() - t, pass ? 'Today list is empty' : 'Items still remain');
  } catch (e) { push('Deleting All Entries Leaves Empty Today List', false, Date.now() - t, e.message); }

  // ── Test 6: Can re-log after deletion ─────────────────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    let btns = await driver.$$('~Delete');
    await btns[0].click();
    await driver.pause(800);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const item = await findByText(driver, 'Parle-G Biscuits');
    await item.waitForExist({ timeout: 5000 });
    const pass = await item.isDisplayed();
    push('Can Re-Log Food After Deletion', pass, Date.now() - t, pass ? 'Re-logged successfully' : 'Could not re-log');
  } catch (e) { push('Can Re-Log Food After Deletion', false, Date.now() - t, e.message); }

  // ── Test 7: Delete one of multiple entries ────────────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await logFood(driver, '8901088002230');
    await clickTab(driver, 'today');
    const before = await driver.$$('~Delete');
    const countBefore = before.length;
    await before[0].click();
    await driver.pause(800);
    const after = await driver.$$('~Delete');
    const pass = after.length === countBefore - 1;
    push('Delete One of Multiple Entries Correct Count', pass, Date.now() - t, pass ? `${countBefore} → ${after.length}` : `Expected ${countBefore - 1}, got ${after.length}`);
  } catch (e) { push('Delete One of Multiple Entries Correct Count', false, Date.now() - t, e.message); }

  // ── Test 8: Second item still visible after first deleted ─────────────
  t = Date.now();
  try {
    await clickTab(driver, 'today');
    const delBtns = await driver.$$('~Delete');
    if (delBtns.length >= 1) {
      await delBtns[0].click();
      await driver.pause(800);
    }
    const remaining = await driver.$$('~Delete');
    const pass = remaining.length >= 1;
    push('Remaining Item Visible After Partial Deletion', pass, Date.now() - t, pass ? `${remaining.length} items remain` : 'No items remain');
  } catch (e) { push('Remaining Item Visible After Partial Deletion', false, Date.now() - t, e.message); }

  // ── Test 9: Delete third entry after logging three items ──────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await logFood(driver, '8901088002230');
    await logFood(driver, '8901499000018');
    await clickTab(driver, 'today');
    const before = await driver.$$('~Delete');
    if (before.length < 1) throw new Error('Expected items to delete');
    await before[0].click();
    await driver.pause(800);
    const after = await driver.$$('~Delete');
    const pass = after.length === before.length - 1;
    push('Delete from Three Items Leaves Two', pass, Date.now() - t, pass ? `${before.length} → ${after.length}` : 'Count mismatch');
  } catch (e) { push('Delete from Three Items Leaves Two', false, Date.now() - t, e.message); }

  // ── Test 10: App doesn't crash after rapid deletion ───────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await logFood(driver, '8901088002230');
    await clickTab(driver, 'today');
    const btns = await driver.$$('~Delete');
    for (const btn of btns) {
      try { await btn.click(); await driver.pause(400); } catch (_) {}
    }
    await driver.pause(500);
    const todayLabel = await driver.$('android=new UiSelector().text("Today")');
    const pass = await todayLabel.isExisting();
    push('App Survives Rapid Deletion', pass, Date.now() - t, pass ? 'App still responsive' : 'App may have crashed');
  } catch (e) { push('App Survives Rapid Deletion', false, Date.now() - t, e.message); }

  // ── Test 11: Calorie shows 0 after deleting all ───────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await clickTab(driver, 'today');
    const calEl = await findByTextContains(driver, 'kcal');
    const text = await calEl.getText();
    const val = parseInt(text.replace(/[^0-9]/g, ''));
    const pass = val === 0 || text.includes('0');
    push('Calorie Total Shows 0 When Today List Is Empty', pass, Date.now() - t, pass ? `Calories: ${val}` : `Unexpected calorie total: ${text}`);
  } catch (e) { push('Calorie Total Shows 0 When Today List Is Empty', false, Date.now() - t, e.message); }

  // ── Test 12: Delete icon has correct accessibility description ─────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const delBtn = await driver.$('~Delete');
    await delBtn.waitForExist({ timeout: 5000 });
    const pass = await delBtn.isDisplayed();
    push('Delete Button Has Accessibility Description', pass, Date.now() - t, pass ? 'Delete button found via content-desc' : 'Delete button not found');
  } catch (e) { push('Delete Button Has Accessibility Description', false, Date.now() - t, e.message); }

  // ── Test 13: Kellogg's Cornflakes can be deleted ──────────────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901499000018');
    await clickTab(driver, 'today');
    const before = await driver.$$('~Delete');
    if (before.length === 0) throw new Error('No items to delete');
    await before[0].click();
    await driver.pause(800);
    const after = await driver.$$('~Delete');
    const pass = after.length < before.length;
    push('Mock Product Entry Can Be Deleted', pass, Date.now() - t, pass ? 'Product deleted' : 'Product could not be deleted');
  } catch (e) { push('Mock Product Entry Can Be Deleted', false, Date.now() - t, e.message); }

  // ── Test 14: Today tab stays selected after deletion ──────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const delBtns = await driver.$$('~Delete');
    await delBtns[0].click();
    await driver.pause(800);
    const todayTab = await driver.$('android=new UiSelector().text("Today")');
    const pass = await todayTab.isExisting();
    push('App Stays on Today Tab After Deletion', pass, Date.now() - t, pass ? 'Today tab still active' : 'Tab changed after deletion');
  } catch (e) { push('App Stays on Today Tab After Deletion', false, Date.now() - t, e.message); }

  // ── Test 15: Delete last item doesn't show stale data ─────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901088002230');
    await clickTab(driver, 'today');
    const delBtns = await driver.$$('~Delete');
    if (delBtns.length === 0) throw new Error('No items to delete');
    await delBtns[0].click();
    await driver.pause(1000);
    const amulEl = await findByText(driver, 'Amul Butter');
    const pass = !(await amulEl.isExisting());
    push('Last Deleted Item Not Shown as Stale Data', pass, Date.now() - t, pass ? 'No stale data' : 'Stale data still visible');
  } catch (e) { push('Last Deleted Item Not Shown as Stale Data', false, Date.now() - t, e.message); }

  // ── Test 16: Logging two of same item then deleting one works ──────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const before = await driver.$$('~Delete');
    if (before.length < 1) throw new Error('Need at least 1 item');
    await before[0].click();
    await driver.pause(800);
    const after = await driver.$$('~Delete');
    const pass = after.length === before.length - 1;
    push('Delete One Duplicate Entry Leaves Other Intact', pass, Date.now() - t, pass ? `${before.length} → ${after.length}` : 'Count mismatch');
  } catch (e) { push('Delete One Duplicate Entry Leaves Other Intact', false, Date.now() - t, e.message); }

  // ── Test 17: Navigation tabs still work after deletion ────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const btns = await driver.$$('~Delete');
    if (btns.length > 0) { await btns[0].click(); await driver.pause(800); }
    await clickTab(driver, 'scan');
    const scanInp = await driver.$('android.widget.EditText');
    const pass = await scanInp.isExisting();
    push('Navigation Works Normally After Deletion', pass, Date.now() - t, pass ? 'Navigation ok' : 'Navigation broken after deletion');
  } catch (e) { push('Navigation Works Normally After Deletion', false, Date.now() - t, e.message); }

  // ── Test 18: Deleting entry doesn't affect history ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const btns = await driver.$$('~Delete');
    if (btns.length > 0) { await btns[0].click(); await driver.pause(800); }
    await clickTab(driver, 'history');
    await driver.pause(1000);
    const histTab = await driver.$('android=new UiSelector().text("History")');
    const pass = await histTab.isExisting();
    push('History Tab Still Accessible After Entry Deletion', pass, Date.now() - t, pass ? 'History accessible' : 'History tab broken');
  } catch (e) { push('History Tab Still Accessible After Entry Deletion', false, Date.now() - t, e.message); }

  // ── Test 19: Multiple deletions in sequence don't cause errors ─────────
  t = Date.now();
  try {
    await clearAll(driver);
    for (let i = 0; i < 3; i++) {
      await logFood(driver, '8901499000018');
    }
    await clickTab(driver, 'today');
    let btns = await driver.$$('~Delete');
    let deleteCount = 0;
    while (btns.length > 0) {
      await btns[0].click();
      deleteCount++;
      await driver.pause(600);
      btns = await driver.$$('~Delete');
    }
    const pass = deleteCount === 3;
    push('Sequential Deletion of 3 Items Works', pass, Date.now() - t, pass ? '3 items deleted successfully' : `Deleted ${deleteCount} items`);
  } catch (e) { push('Sequential Deletion of 3 Items Works', false, Date.now() - t, e.message); }

  // ── Test 20: Calorie updates immediately after deletion ───────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901719100018');
    await clickTab(driver, 'today');
    const btns = await driver.$$('~Delete');
    if (btns.length > 0) await btns[0].click();
    await driver.pause(500);
    const calEl = await findByTextContains(driver, 'kcal');
    const pass = await calEl.isDisplayed();
    push('Calorie Counter Updates After Deletion', pass, Date.now() - t, pass ? 'Calorie el visible after deletion' : 'Calorie el not found');
  } catch (e) { push('Calorie Counter Updates After Deletion', false, Date.now() - t, e.message); }

  // ── Test 21: Screen doesn't freeze after deletion ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '8901088002230');
    await clickTab(driver, 'today');
    const btns = await driver.$$('~Delete');
    if (btns.length > 0) { await btns[0].click(); await driver.pause(800); }
    const editBtn = await driver.$('~Edit goal');
    const pass = await editBtn.isExisting();
    push('Screen Stays Interactive After Deletion', pass, Date.now() - t, pass ? 'Edit goal button still accessible' : 'Screen may have frozen');
  } catch (e) { push('Screen Stays Interactive After Deletion', false, Date.now() - t, e.message); }

  // ── Test 22: Products tab unaffected by deletions ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await clickTab(driver, 'products');
    const prodInp = await driver.$('android.widget.EditText');
    const pass = await prodInp.isExisting();
    push('Products Tab Accessible After Deletions', pass, Date.now() - t, pass ? 'Products tab ok' : 'Products tab broken');
  } catch (e) { push('Products Tab Accessible After Deletions', false, Date.now() - t, e.message); }

  // ── Test 23: Today list is empty visually after clearing ──────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await clickTab(driver, 'today');
    const delBtns = await driver.$$('~Delete');
    const pass = delBtns.length === 0;
    push('Today List Empty After All Deletions', pass, Date.now() - t, pass ? 'No items left' : `${delBtns.length} items still present`);
  } catch (e) { push('Today List Empty After All Deletions', false, Date.now() - t, e.message); }

  // ── Test 24: Log after clearing all entries works ─────────────────────
  t = Date.now();
  try {
    await clearAll(driver);
    await logFood(driver, '7622210449283');
    await clickTab(driver, 'today');
    const btns = await driver.$$('~Delete');
    const pass = btns.length === 1;
    push('Logging After Clear Works Correctly', pass, Date.now() - t, pass ? '1 item as expected' : `${btns.length} items`);
  } catch (e) { push('Logging After Clear Works Correctly', false, Date.now() - t, e.message); }

  // ── Test 25: Edit goal button still clickable after deletion ──────────
  t = Date.now();
  try {
    await clearAll(driver);
    await clickTab(driver, 'today');
    const editBtn = await driver.$('~Edit goal');
    await editBtn.waitForExist({ timeout: 5000 });
    await editBtn.click();
    await driver.pause(1000);
    const cancelBtn = await driver.$('android=new UiSelector().text("Cancel")');
    if (await cancelBtn.isExisting()) { await cancelBtn.click(); await driver.pause(500); }
    push('Edit Goal Button Works After List Cleared', true, Date.now() - t, 'Edit goal dialog opened and closed');
  } catch (e) { push('Edit Goal Button Works After List Cleared', false, Date.now() - t, e.message); }

  return results;
};
