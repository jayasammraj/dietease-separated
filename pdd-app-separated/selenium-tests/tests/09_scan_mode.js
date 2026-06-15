/**
 * TEST 09 — Scan Mode (10 tests)
 */
const { navigateTo, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(300);
  await driver.executeScript('arguments[0].click();', el);
}

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Scan Mode', error:info, timestamp:Date.now() });

  // T1 — Live tab active by default
  let t0 = Date.now();
  try {
    const cls = await driver.findElement(By.id('tab-live')).getAttribute('class');
    push('Live Camera Tab Active by Default', cls.includes('active'), Date.now()-t0, cls.includes('active')?'Live tab active':'Live tab not active');
  } catch(e) { push('Live Camera Tab Active by Default', false, Date.now()-t0, e.message); }

  // T2 — Photo tab becomes active
  t0 = Date.now();
  try {
    await jsClick(driver, await driver.findElement(By.id('tab-photo'))); await driver.sleep(400);
    const cls = await driver.findElement(By.id('tab-photo')).getAttribute('class');
    push('Photo Tab Becomes Active After Click', cls.includes('active'), Date.now()-t0, cls.includes('active')?'Photo tab active':'Photo tab not active');
  } catch(e) { push('Photo Tab Becomes Active After Click', false, Date.now()-t0, e.message); }

  // T3 — Photo panel visible
  t0 = Date.now();
  try {
    const cls = await driver.findElement(By.id('panel-photo')).getAttribute('class');
    push('Photo Panel Visible After Tab Switch', cls.includes('show'), Date.now()-t0, cls.includes('show')?'panel-photo shown':'panel-photo hidden');
  } catch(e) { push('Photo Panel Visible After Tab Switch', false, Date.now()-t0, e.message); }

  // T4 — Live panel returns
  t0 = Date.now();
  try {
    await jsClick(driver, await driver.findElement(By.id('tab-live'))); await driver.sleep(400);
    const cls = await driver.findElement(By.id('panel-live')).getAttribute('class');
    push('Live Panel Returns on Switching Back', cls.includes('show'), Date.now()-t0, cls.includes('show')?'panel-live shown':'panel-live hidden');
  } catch(e) { push('Live Panel Returns on Switching Back', false, Date.now()-t0, e.message); }

  // T5 — Start camera button
  t0 = Date.now();
  try {
    const btn = await driver.findElement(By.id('startBtn'));
    const vis = await btn.isDisplayed();
    push('"Start Camera" Button Present in Live Mode', vis, Date.now()-t0, vis?'Start button visible':'Not visible');
  } catch(e) { push('"Start Camera" Button Present in Live Mode', false, Date.now()-t0, e.message); }

  // T6 — Photo upload area exists
  t0 = Date.now();
  try {
    await jsClick(driver, await driver.findElement(By.id('tab-photo'))); await driver.sleep(400);
    const area = await driver.findElement(By.id('photoArea'));
    const vis = await area.isDisplayed();
    push('Photo Upload Area Exists', vis, Date.now()-t0, vis?'photoArea visible':'photoArea not visible');
  } catch(e) { push('Photo Upload Area Exists', false, Date.now()-t0, e.message); }

  // T7 — File input exists
  t0 = Date.now();
  try {
    const fileInput = await driver.findElement(By.id('photoInput'));
    const exists = await driver.executeScript('return arguments[0] !== null', fileInput);
    push('File Input for Photo Upload Exists', exists, Date.now()-t0, exists?'photoInput found':'photoInput not found');
  } catch(e) { push('File Input for Photo Upload Exists', false, Date.now()-t0, e.message); }

  // T8 — Idle state in camera box
  t0 = Date.now();
  try {
    await jsClick(driver, await driver.findElement(By.id('tab-live'))); await driver.sleep(400);
    const idle = await driver.findElements(By.className('idle'));
    push('Idle State Shown in Camera Area', idle.length>0, Date.now()-t0, idle.length>0?'Idle placeholder shown':'No idle element found');
  } catch(e) { push('Idle State Shown in Camera Area', false, Date.now()-t0, e.message); }

  // T9 — Scan frame / scan line element present
  t0 = Date.now();
  try {
    const sline = await driver.findElements(By.className('sline'));
    push('Scan Line Animation Element Present', sline.length>0, Date.now()-t0, sline.length>0?'Scan line found':'sline element missing');
  } catch(e) { push('Scan Line Animation Element Present', false, Date.now()-t0, e.message); }

  // T10 — Manual barcode row visible on scan page
  t0 = Date.now();
  try {
    const mrow = await driver.findElement(By.className('mrow'));
    const vis = await mrow.isDisplayed();
    push('Manual Barcode Input Row Visible on Scan Page', vis, Date.now()-t0, vis?'.mrow visible':'mrow not visible');
  } catch(e) { push('Manual Barcode Input Row Visible on Scan Page', false, Date.now()-t0, e.message); }

  return results;
};
