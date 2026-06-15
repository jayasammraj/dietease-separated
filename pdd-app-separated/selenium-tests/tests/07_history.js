/**
 * TEST 07 — History (8 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  await clickTab(driver, 'history'); await driver.sleep(800);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'History', error:info, timestamp:Date.now() });

  // T1 — Export CSV button
  let t0 = Date.now();
  try {
    const btn = await driver.findElement(By.className('export-btn'));
    const vis = await btn.isDisplayed();
    push('Export CSV Button Exists on History Page', vis, Date.now()-t0, vis?'Export button visible':'Not visible');
  } catch(e) { push('Export CSV Button Exists on History Page', false, Date.now()-t0, e.message); }

  // T2 — Date picker area
  t0 = Date.now();
  try {
    const dp = await driver.findElement(By.id('datePicker'));
    const vis = await dp.isDisplayed();
    push('Date Picker Area Visible in History', vis, Date.now()-t0, vis?'Date picker visible':'Not visible');
  } catch(e) { push('Date Picker Area Visible in History', false, Date.now()-t0, e.message); }

  // T3 — 4 macro summary boxes
  t0 = Date.now();
  try {
    const boxes = await driver.findElements(By.className('hs-box'));
    push('History Shows 4 Macro Summary Boxes', boxes.length>=4, Date.now()-t0, boxes.length>=4?`${boxes.length} macro boxes present`:`Only ${boxes.length} boxes`);
  } catch(e) { push('History Shows 4 Macro Summary Boxes', false, Date.now()-t0, e.message); }

  // T4 — kcal label
  t0 = Date.now();
  try {
    const labels = await driver.findElements(By.className('hs-lbl'));
    const texts = await Promise.all(labels.map(l=>driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', l)));
    const pass = texts.some(t=>t.toLowerCase().includes('kcal'));
    push('History Summary Has kcal Label', pass, Date.now()-t0, pass?'kcal label found':`Labels: ${texts.join(', ')}`);
  } catch(e) { push('History Summary Has kcal Label', false, Date.now()-t0, e.message); }

  // T5 — protein label
  t0 = Date.now();
  try {
    const labels = await driver.findElements(By.className('hs-lbl'));
    const texts = await Promise.all(labels.map(l=>driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', l)));
    const pass = texts.some(t=>t.toLowerCase().includes('protein'));
    push('History Summary Has Protein Label', pass, Date.now()-t0, pass?'Protein label found':`Labels: ${texts.join(', ')}`);
  } catch(e) { push('History Summary Has Protein Label', false, Date.now()-t0, e.message); }

  // T6 — carbs label
  t0 = Date.now();
  try {
    const labels = await driver.findElements(By.className('hs-lbl'));
    const texts = await Promise.all(labels.map(l=>driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', l)));
    const pass = texts.some(t=>t.toLowerCase().includes('carb'));
    push('History Summary Has Carbs Label', pass, Date.now()-t0, pass?'Carbs label found':`Labels: ${texts.join(', ')}`);
  } catch(e) { push('History Summary Has Carbs Label', false, Date.now()-t0, e.message); }

  // T7 — fat label
  t0 = Date.now();
  try {
    const labels = await driver.findElements(By.className('hs-lbl'));
    const texts = await Promise.all(labels.map(l=>driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', l)));
    const pass = texts.some(t=>t.toLowerCase().includes('fat'));
    push('History Summary Has Fat Label', pass, Date.now()-t0, pass?'Fat label found':`Labels: ${texts.join(', ')}`);
  } catch(e) { push('History Summary Has Fat Label', false, Date.now()-t0, e.message); }

  // T8 — History list container exists
  t0 = Date.now();
  try {
    const list = await driver.findElement(By.id('histList'));
    const vis = await list.isDisplayed();
    push('History List Container Exists', vis, Date.now()-t0, vis?'histList visible':'histList not visible');
  } catch(e) { push('History List Container Exists', false, Date.now()-t0, e.message); }

  return results;
};
