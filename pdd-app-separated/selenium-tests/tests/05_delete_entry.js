/**
 * TEST 05 — Delete Entry (4 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(400);
  await driver.executeScript('arguments[0].click();', el);
}

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Delete Entry', error:info, timestamp:Date.now() });

  // T1 — Delete removes item
  let t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(1200);
    await clickTab(driver, 'today'); await driver.sleep(1000);
    let beforeCount = (await driver.findElements(By.className('litem'))).length;
    if (beforeCount === 0) {
      await clickTab(driver, 'scan'); await driver.sleep(600);
      const inp = await driver.findElement(By.id('manualInput'));
      await inp.clear(); await inp.sendKeys('8901719100018');
      await jsClick(driver, await driver.findElement(By.css('.mrow button')));
      await driver.wait(async () => { const c=await driver.findElement(By.id('resultCard')).getAttribute('class'); return c.includes('on'); }, 10000);
      await jsClick(driver, await driver.findElement(By.className('logbtn')));
      await driver.sleep(1500);
      await clickTab(driver, 'today'); await driver.sleep(1000);
      beforeCount = (await driver.findElements(By.className('litem'))).length;
    }
    if (beforeCount === 0) throw new Error('No items to delete');
    const delBtns = await driver.findElements(By.className('delbtn'));
    await jsClick(driver, delBtns[0]); await driver.sleep(800);
    const afterCount = (await driver.findElements(By.className('litem'))).length;
    push('Delete Entry Removes Item from Log', afterCount < beforeCount, Date.now()-t0, afterCount < beforeCount?`${beforeCount} → ${afterCount} items`:`Count unchanged: ${afterCount}`);
  } catch(e) { push('Delete Entry Removes Item from Log', false, Date.now()-t0, e.message); }

  // T2 — Delete button (✕) visible on each item
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(1000);
    const inp = await driver.findElement(By.id('manualInput'));
    await inp.clear(); await inp.sendKeys('8901719100018');
    await jsClick(driver, await driver.findElement(By.css('.mrow button')));
    await driver.wait(async () => { const c=await driver.findElement(By.id('resultCard')).getAttribute('class'); return c.includes('on'); }, 8000);
    await jsClick(driver, await driver.findElement(By.className('logbtn')));
    await driver.sleep(1200);
    await clickTab(driver, 'today'); await driver.sleep(800);
    const delBtns = await driver.findElements(By.className('delbtn'));
    push('Delete Button (✕) Present on Each Log Item', delBtns.length > 0, Date.now()-t0, delBtns.length > 0?`${delBtns.length} delete button(s) found`:'No delete buttons found');
  } catch(e) { push('Delete Button (✕) Present on Each Log Item', false, Date.now()-t0, e.message); }

  // T3 — Delete updates calorie total
  t0 = Date.now();
  try {
    const calBefore = await driver.executeScript('return document.getElementById("totalCal").innerText||document.getElementById("totalCal").textContent||"0"');
    const delBtns = await driver.findElements(By.className('delbtn'));
    if (delBtns.length === 0) throw new Error('No items to delete for calorie check');
    await jsClick(driver, delBtns[0]); await driver.sleep(800);
    const calAfter = await driver.executeScript('return document.getElementById("totalCal").innerText||document.getElementById("totalCal").textContent||"0"');
    const pass = parseInt(calAfter) < parseInt(calBefore);
    push('Deleting Entry Reduces Calorie Total', pass, Date.now()-t0, pass?`${calBefore} → ${calAfter} kcal`:`Unchanged: ${calBefore}`);
  } catch(e) { push('Deleting Entry Reduces Calorie Total', false, Date.now()-t0, e.message); }

  // T4 — All items deleted shows empty state
  t0 = Date.now();
  try {
    let delBtns = await driver.findElements(By.className('delbtn'));
    while (delBtns.length > 0) {
      await jsClick(driver, delBtns[0]);
      await driver.sleep(500);
      delBtns = await driver.findElements(By.className('delbtn'));
    }
    await driver.sleep(500);
    const empty = await driver.findElements(By.className('empty'));
    const items = await driver.findElements(By.className('litem'));
    const pass = empty.length > 0 && items.length === 0;
    push('All Items Deleted Shows Empty State', pass, Date.now()-t0, pass?'Empty state shown after all deletions':`Items remaining: ${items.length}`);
  } catch(e) { push('All Items Deleted Shows Empty State', false, Date.now()-t0, e.message); }

  return results;
};
