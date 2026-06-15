/**
 * TEST 03 — Barcode Lookup (12 tests)
 */
const { navigateTo, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(300);
  await driver.executeScript('arguments[0].click();', el);
}

async function safenavigate(driver) {
  for (let i = 0; i < 3; i++) {
    try { await navigateTo(driver); await driver.sleep(1000); return; } catch(_) { await driver.sleep(2000); }
  }
  throw new Error('Page failed to load after 3 attempts');
}

async function lookup(driver, code) {
  const input = await driver.findElement(By.id('manualInput'));
  await input.clear(); await input.sendKeys(code);
  await jsClick(driver, await driver.findElement(By.css('.mrow button')));
}

async function waitForCard(driver, ms=5000) {
  await driver.wait(async () => {
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    return cls.includes('on');
  }, ms, 'Result card not shown');
}

module.exports = async function runTests(driver) {
  const results = [];
  await safenavigate(driver);

  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Barcode Lookup', error:info, timestamp:Date.now() });

  // T1 — Input exists
  let t0 = Date.now();
  try {
    const visible = await driver.findElement(By.id('manualInput')).isDisplayed();
    push('Manual Barcode Input Field Exists', visible, Date.now()-t0, visible?'Input visible':'Input not visible');
  } catch(e) { push('Manual Barcode Input Field Exists', false, Date.now()-t0, e.message); }

  // T2 — Parle-G
  t0 = Date.now();
  try {
    await lookup(driver, '8901719100018'); await driver.sleep(2500);
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    const name = await driver.executeScript('return document.getElementById("rName").innerText||document.getElementById("rName").textContent||""');
    const pass = cls.includes('on') && name.toLowerCase().includes('parle');
    push('Built-in Barcode Lookup (Parle-G 8901719100018)', pass, Date.now()-t0, pass?`Found: ${name}`:`name="${name}"`);
  } catch(e) { push('Built-in Barcode Lookup (Parle-G 8901719100018)', false, Date.now()-t0, e.message); }

  // T3 — Calories
  t0 = Date.now();
  try {
    const cal = await driver.executeScript('return document.getElementById("rCal").innerText||document.getElementById("rCal").textContent||""');
    const pass = parseInt(cal) > 0;
    push('Calories Shown After Barcode Lookup', pass, Date.now()-t0, pass?`Calories: ${cal}`:`Got: "${cal}"`);
  } catch(e) { push('Calories Shown After Barcode Lookup', false, Date.now()-t0, e.message); }

  // T4 — Macros
  t0 = Date.now();
  try {
    const p = await driver.executeScript('return document.getElementById("rProt").innerText||document.getElementById("rProt").textContent||""');
    const c = await driver.executeScript('return document.getElementById("rCarb").innerText||document.getElementById("rCarb").textContent||""');
    const f = await driver.executeScript('return document.getElementById("rFat").innerText||document.getElementById("rFat").textContent||""');
    const pass = p!=='—' && c!=='—' && f!=='—';
    push('Macros (Protein/Carbs/Fat) Displayed', pass, Date.now()-t0, pass?`P:${p} C:${c} F:${f}`:'Macros show dash');
  } catch(e) { push('Macros (Protein/Carbs/Fat) Displayed', false, Date.now()-t0, e.message); }

  // T5 — Amul Butter
  t0 = Date.now();
  try {
    await safenavigate(driver); await lookup(driver, '8901088002230'); await driver.sleep(2500);
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    const name = await driver.executeScript('return document.getElementById("rName").innerText||""');
    const pass = cls.includes('on') && name.toLowerCase().includes('amul');
    push('Built-in Barcode Lookup (Amul Butter 8901088002230)', pass, Date.now()-t0, pass?`Found: ${name}`:`name="${name}"`);
  } catch(e) { push('Built-in Barcode Lookup (Amul Butter 8901088002230)', false, Date.now()-t0, e.message); }

  // T6 — Britannia Good Day
  t0 = Date.now();
  try {
    await safenavigate(driver); await lookup(driver, '8901063032019'); await driver.sleep(2500);
    const name = await driver.executeScript('return document.getElementById("rName").innerText||""');
    const pass = name.toLowerCase().includes('britannia');
    push('Built-in Barcode Lookup (Britannia Good Day 8901063032019)', pass, Date.now()-t0, pass?`Found: ${name}`:`name="${name}"`);
  } catch(e) { push('Built-in Barcode Lookup (Britannia Good Day 8901063032019)', false, Date.now()-t0, e.message); }

  // T7 — Cadbury
  t0 = Date.now();
  try {
    await safenavigate(driver); await lookup(driver, '7622210449283'); await driver.sleep(2500);
    const name = await driver.executeScript('return document.getElementById("rName").innerText||""');
    const pass = name.toLowerCase().includes('cadbury');
    push('Built-in Barcode Lookup (Cadbury Dairy Milk 7622210449283)', pass, Date.now()-t0, pass?`Found: ${name}`:`name="${name}"`);
  } catch(e) { push('Built-in Barcode Lookup (Cadbury Dairy Milk 7622210449283)', false, Date.now()-t0, e.message); }

  // T8 — Result card shows product name heading
  t0 = Date.now();
  try {
    const nameEl = await driver.findElement(By.id('rName'));
    const visible = await driver.executeScript('return arguments[0].offsetParent!==null', nameEl);
    push('Result Card Shows Product Name', visible, Date.now()-t0, visible?'rName element visible':'rName not visible');
  } catch(e) { push('Result Card Shows Product Name', false, Date.now()-t0, e.message); }

  // T9 — Result card shows brand
  t0 = Date.now();
  try {
    const brand = await driver.executeScript('const b=document.getElementById("rBrand");return b?b.innerText||b.textContent:"(no rBrand element)"');
    const pass = brand && brand !== '(no rBrand element)';
    push('Result Card Shows Brand Name', pass, Date.now()-t0, pass?`Brand: "${brand}"`:'No brand element found');
  } catch(e) { push('Result Card Shows Brand Name', false, Date.now()-t0, e.message); }

  // T10 — Servings counter starts at 1
  t0 = Date.now();
  try {
    const sc = await driver.executeScript('return document.getElementById("sc").innerText||document.getElementById("sc").textContent||""');
    const pass = parseFloat(sc) >= 1;
    push('Servings Counter Starts at 1', pass, Date.now()-t0, pass?`Servings: ${sc}`:`Got: "${sc}"`);
  } catch(e) { push('Servings Counter Starts at 1', false, Date.now()-t0, e.message); }

  // T11 — Lookup barcode by Enter key
  t0 = Date.now();
  try {
    await safenavigate(driver);
    const input = await driver.findElement(By.id('manualInput'));
    await input.clear(); await input.sendKeys('8901719100018');
    await input.sendKeys('\n'); // Enter key
    await driver.sleep(2500);
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    push('Lookup Barcode via Enter Key Press', cls.includes('on'), Date.now()-t0, cls.includes('on')?'Enter key triggered lookup':'Card not shown after Enter');
  } catch(e) { push('Lookup Barcode via Enter Key Press', false, Date.now()-t0, e.message); }

  // T12 — Result card has log button
  t0 = Date.now();
  try {
    const logBtn = await driver.findElement(By.className('logbtn'));
    const visible = await driver.executeScript('return arguments[0].offsetParent!==null', logBtn);
    push('Result Card Has Log Button', visible, Date.now()-t0, visible?'Log button visible':'Log button hidden');
  } catch(e) { push('Result Card Has Log Button', false, Date.now()-t0, e.message); }

  return results;
};
