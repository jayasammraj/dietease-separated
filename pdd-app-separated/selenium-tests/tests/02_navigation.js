/**
 * TEST 02 — Navigation (12 tests)
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver);
  await driver.sleep(800);

  const push = (name, pass, dur, cat, info) =>
    results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:cat, error:info, timestamp:Date.now() });

  // T1 — Scan active on load
  let t0 = Date.now();
  try {
    const cls = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Scan Page Active on Load', cls.includes('active'), Date.now()-t0, 'Navigation', cls.includes('active')?'Scan tab active':'Scan tab not active');
  } catch(e) { results.push({ name:'Scan Page Active on Load', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T2 — Today tab
  t0 = Date.now();
  try {
    await clickTab(driver, 'today'); await driver.sleep(800);
    const shown = await driver.findElement(By.id('page-today')).getAttribute('class');
    push('Today Tab Shows Today\'s Log', shown.includes('show'), Date.now()-t0, 'Navigation', shown.includes('show')?'Today page shown':'Today page hidden');
  } catch(e) { results.push({ name:'Today Tab Shows Today\'s Log', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T3 — History tab
  t0 = Date.now();
  try {
    await clickTab(driver, 'history'); await driver.sleep(800);
    const shown = await driver.findElement(By.id('page-history')).getAttribute('class');
    push('History Tab Shows Food History', shown.includes('show'), Date.now()-t0, 'Navigation', shown.includes('show')?'History page shown':'History page hidden');
  } catch(e) { results.push({ name:'History Tab Shows Food History', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T4 — Products tab
  t0 = Date.now();
  try {
    await clickTab(driver, 'products'); await driver.sleep(800);
    const shown = await driver.findElement(By.id('page-products')).getAttribute('class');
    push('Products Tab Shows Product Database', shown.includes('show'), Date.now()-t0, 'Navigation', shown.includes('show')?'Products page shown':'Products page hidden');
  } catch(e) { results.push({ name:'Products Tab Shows Product Database', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T5 — Back to Scan
  t0 = Date.now();
  try {
    await clickTab(driver, 'scan'); await driver.sleep(800);
    const cls = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Navigate Back to Scan Tab', cls.includes('active'), Date.now()-t0, 'Navigation', cls.includes('active')?'Scan active':'Scan not active');
  } catch(e) { results.push({ name:'Navigate Back to Scan Tab', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T6 — Scan tab label
  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-scan").innerText||document.getElementById("nav-scan").textContent||""');
    const pass = label.toLowerCase().includes('scan');
    push('Scan Tab Label Contains "Scan"', pass, Date.now()-t0, 'Navigation', pass?`Label: "${label.trim()}"`:`Label: "${label}"`);
  } catch(e) { results.push({ name:'Scan Tab Label Contains "Scan"', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T7 — Today tab label
  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-today").innerText||document.getElementById("nav-today").textContent||""');
    const pass = label.toLowerCase().includes('today');
    push('Today Tab Label Contains "Today"', pass, Date.now()-t0, 'Navigation', pass?`Label: "${label.trim()}"`:`Label: "${label}"`);
  } catch(e) { results.push({ name:'Today Tab Label Contains "Today"', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T8 — History tab label
  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-history").innerText||document.getElementById("nav-history").textContent||""');
    const pass = label.toLowerCase().includes('history');
    push('History Tab Label Contains "History"', pass, Date.now()-t0, 'Navigation', pass?`Label: "${label.trim()}"`:`Label: "${label}"`);
  } catch(e) { results.push({ name:'History Tab Label Contains "History"', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T9 — Products tab label
  t0 = Date.now();
  try {
    const label = await driver.executeScript('return document.getElementById("nav-products").innerText||document.getElementById("nav-products").textContent||""');
    const pass = label.toLowerCase().includes('product');
    push('Products Tab Label Contains "Products"', pass, Date.now()-t0, 'Navigation', pass?`Label: "${label.trim()}"`:`Label: "${label}"`);
  } catch(e) { results.push({ name:'Products Tab Label Contains "Products"', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T10 — Scan tab active class on default
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(600);
    const cls = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Scan Tab Has Active Class by Default', cls.includes('active'), Date.now()-t0, 'Navigation', cls.includes('active')?'Active class confirmed':'No active class on scan tab');
  } catch(e) { results.push({ name:'Scan Tab Has Active Class by Default', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T11 — Only one tab active at a time
  t0 = Date.now();
  try {
    await clickTab(driver, 'today'); await driver.sleep(400);
    const activeTabs = await driver.findElements(By.css('.nav-tab.active'));
    const pass = activeTabs.length === 1;
    push('Only One Nav Tab Active at a Time', pass, Date.now()-t0, 'Navigation', pass?`1 active tab found`:`${activeTabs.length} active tabs`);
  } catch(e) { results.push({ name:'Only One Nav Tab Active at a Time', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  // T12 — Scan page shown by default
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(600);
    const cls = await driver.findElement(By.id('page-scan')).getAttribute('class');
    push('Scan Page is Shown by Default', cls.includes('show'), Date.now()-t0, 'Navigation', cls.includes('show')?'page-scan has "show"':'page-scan missing "show"');
  } catch(e) { results.push({ name:'Scan Page is Shown by Default', status:'FAIL', duration:Date.now()-t0, category:'Navigation', error:e.message, timestamp:Date.now() }); }

  return results;
};
