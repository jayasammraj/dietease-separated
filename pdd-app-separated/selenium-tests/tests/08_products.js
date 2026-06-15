/**
 * TEST 08 — Products (10 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

async function jsClick(driver, el) {
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
  await driver.sleep(300);
  await driver.executeScript('arguments[0].click();', el);
}

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  await clickTab(driver, 'products'); await driver.sleep(800);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Products', error:info, timestamp:Date.now() });

  // T1 — Products list has items
  let t0 = Date.now();
  try {
    const items = await driver.findElements(By.className('prod-item'));
    push('Products List Shows Built-in Items (≥10)', items.length>=10, Date.now()-t0, items.length>=10?`${items.length} products loaded`:`Only ${items.length}`);
  } catch(e) { push('Products List Shows Built-in Items (≥10)', false, Date.now()-t0, e.message); }

  // T2 — Search bar visible
  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    const vis = await sb.isDisplayed();
    push('Product Search Bar is Visible', vis, Date.now()-t0, vis?'Search bar visible':'Not visible');
  } catch(e) { push('Product Search Bar is Visible', false, Date.now()-t0, e.message); }

  // T3 — Search filters (parle)
  t0 = Date.now();
  try {
    const total = (await driver.findElements(By.className('prod-item'))).length;
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('parle');
    await driver.sleep(600);
    const filtered = await driver.findElements(By.className('prod-item'));
    const pass = filtered.length > 0 && filtered.length < total;
    push('Product Search Filters Results (searching "parle")', pass, Date.now()-t0, pass?`${total} → ${filtered.length} results`:`Filtered: ${filtered.length}`);
  } catch(e) { push('Product Search Filters Results (searching "parle")', false, Date.now()-t0, e.message); }

  // T4 — Clear search restores list
  t0 = Date.now();
  try {
    const total = (await driver.findElements(By.className('prod-item'))).length;
    const sb = await driver.findElement(By.id('prodSearch'));
    await driver.executeScript("arguments[0].value=''", sb);
    await driver.executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))", sb);
    await driver.sleep(600);
    const restored = await driver.findElements(By.className('prod-item'));
    push('Clearing Search Restores Full Product List', restored.length >= 10, Date.now()-t0, restored.length>=10?`${restored.length} items restored`:`Only ${restored.length}`);
  } catch(e) { push('Clearing Search Restores Full Product List', false, Date.now()-t0, e.message); }

  // T5 — Search for cadbury
  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('cadbury');
    await driver.sleep(600);
    const items = await driver.findElements(By.className('prod-item'));
    push('Product Search for "cadbury" Returns Results', items.length>0, Date.now()-t0, items.length>0?`${items.length} cadbury product(s)`:'No cadbury found');
  } catch(e) { push('Product Search for "cadbury" Returns Results', false, Date.now()-t0, e.message); }

  // T6 — Search for amul
  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('amul');
    await driver.sleep(600);
    const items = await driver.findElements(By.className('prod-item'));
    push('Product Search for "amul" Returns Results', items.length>0, Date.now()-t0, items.length>0?`${items.length} amul product(s)`:'No amul found');
  } catch(e) { push('Product Search for "amul" Returns Results', false, Date.now()-t0, e.message); }

  // T7 — Product items show brand
  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await driver.executeScript("arguments[0].value=''", sb);
    await driver.executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))", sb);
    await driver.sleep(600);
    const brandEls = await driver.findElements(By.className('pi-brand'));
    const brand = brandEls.length>0 ? await driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', brandEls[0]) : '';
    push('Product Items Show Brand Name', brand.length>0, Date.now()-t0, brand.length>0?`Brand: "${brand.trim()}"`:'Empty brand field');
  } catch(e) { push('Product Items Show Brand Name', false, Date.now()-t0, e.message); }

  // T8 — Product items show calorie count
  t0 = Date.now();
  try {
    const calEls = await driver.findElements(By.className('pi-cal'));
    const cal = calEls.length>0 ? await driver.executeScript('return arguments[0].innerText||arguments[0].textContent||""', calEls[0]) : '';
    const pass = cal.includes('kcal') && cal.length>0;
    push('Product Items Show Calorie Count', pass, Date.now()-t0, pass?`Calories: "${cal.trim()}"`:`Got: "${cal}"`);
  } catch(e) { push('Product Items Show Calorie Count', false, Date.now()-t0, e.message); }

  // T9 — Search is case insensitive
  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await sb.clear(); await sb.sendKeys('PARLE');
    await driver.sleep(600);
    const upper = (await driver.findElements(By.className('prod-item'))).length;
    await sb.clear(); await sb.sendKeys('parle');
    await driver.sleep(600);
    const lower = (await driver.findElements(By.className('prod-item'))).length;
    push('Product Search is Case-Insensitive', upper===lower && upper>0, Date.now()-t0, upper===lower?`PARLE and parle both return ${upper} result(s)`:`PARLE:${upper} parle:${lower}`);
  } catch(e) { push('Product Search is Case-Insensitive', false, Date.now()-t0, e.message); }

  // T10 — Clicking product navigates to scan
  t0 = Date.now();
  try {
    const sb = await driver.findElement(By.id('prodSearch'));
    await driver.executeScript("arguments[0].value=''", sb);
    await driver.executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true}))", sb);
    await driver.sleep(600);
    const firstProduct = await driver.findElement(By.className('prod-item'));
    await jsClick(driver, firstProduct); await driver.sleep(800);
    const scanActive = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Clicking Product Navigates to Scan Page', scanActive.includes('active'), Date.now()-t0, scanActive.includes('active')?'Navigated to Scan tab':'Scan tab not active');
  } catch(e) { push('Clicking Product Navigates to Scan Page', false, Date.now()-t0, e.message); }

  return results;
};
