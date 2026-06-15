/**
 * TEST 11 — UI & Styling (6 tests) — NEW MODULE
 */
const { navigateTo, clickTab, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver); await driver.sleep(800);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'UI & Styling', error:info, timestamp:Date.now() });

  // T1 — Dark background theme
  let t0 = Date.now();
  try {
    const bg = await driver.executeScript('return getComputedStyle(document.body).backgroundColor');
    // Dark theme: rgb values should be low (dark color)
    const rgb = bg.match(/\d+/g) || [];
    const isDark = rgb.length >= 3 && parseInt(rgb[0]) < 50 && parseInt(rgb[1]) < 50 && parseInt(rgb[2]) < 50;
    push('App Uses Dark Background Theme', isDark, Date.now()-t0, isDark?`BG: ${bg}`:`BG: ${bg} (not dark)`);
  } catch(e) { push('App Uses Dark Background Theme', false, Date.now()-t0, e.message); }

  // T2 — Active tab has accent styling
  t0 = Date.now();
  try {
    const cls = await driver.findElement(By.id('nav-scan')).getAttribute('class');
    push('Active Tab Has Accent Styling Class', cls.includes('active'), Date.now()-t0, cls.includes('active')?`Active class: "${cls}"`:`Class: "${cls}"`);
  } catch(e) { push('Active Tab Has Accent Styling Class', false, Date.now()-t0, e.message); }

  // T3 — Progress bar exists on Today page
  t0 = Date.now();
  try {
    await clickTab(driver, 'today'); await driver.sleep(400);
    const fill = await driver.findElement(By.id('progFill'));
    const exists = await driver.executeScript('return arguments[0]!==null', fill);
    push('Progress Bar Element Exists on Today Page', exists, Date.now()-t0, exists?'progFill found':'progFill missing');
  } catch(e) { push('Progress Bar Element Exists on Today Page', false, Date.now()-t0, e.message); }

  // T4 — Toast container exists
  t0 = Date.now();
  try {
    const toast = await driver.findElement(By.id('toast'));
    const exists = await driver.executeScript('return arguments[0]!==null', toast);
    push('Toast Notification Container Exists', exists, Date.now()-t0, exists?'#toast element found':'#toast missing');
  } catch(e) { push('Toast Notification Container Exists', false, Date.now()-t0, e.message); }

  // T5 — Confetti wrapper exists
  t0 = Date.now();
  try {
    const conf = await driver.findElement(By.id('confwrap'));
    const exists = await driver.executeScript('return arguments[0]!==null', conf);
    push('Confetti Animation Container Exists', exists, Date.now()-t0, exists?'#confwrap found':'#confwrap missing');
  } catch(e) { push('Confetti Animation Container Exists', false, Date.now()-t0, e.message); }

  // T6 — Result card initially hidden (no 'on' class on fresh page load)
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(600);
    const cls = await driver.findElement(By.id('resultCard')).getAttribute('class');
    const hidden = !cls.includes('on');
    push('Result Card Initially Hidden on Page Load', hidden, Date.now()-t0, hidden?'resultCard has no "on" class':'resultCard incorrectly shows "on"');
  } catch(e) { push('Result Card Initially Hidden on Page Load', false, Date.now()-t0, e.message); }

  return results;
};
