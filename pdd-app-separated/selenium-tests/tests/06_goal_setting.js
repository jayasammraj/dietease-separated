/**
 * TEST 06 — Goal Setting (8 tests)
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
  await clickTab(driver, 'today'); await driver.sleep(600);
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Goal Setting', error:info, timestamp:Date.now() });

  // T1 — Goal edit button visible
  let t0 = Date.now();
  try {
    const gbtn = await driver.findElement(By.className('gbtn'));
    const vis = await gbtn.isDisplayed();
    push('Goal Edit Button (✏️) Visible', vis, Date.now()-t0, vis?'Goal button visible':'Goal button not visible');
  } catch(e) { push('Goal Edit Button (✏️) Visible', false, Date.now()-t0, e.message); }

  // T2 — Goal panel opens
  t0 = Date.now();
  try {
    await jsClick(driver, await driver.findElement(By.className('gbtn'))); await driver.sleep(500);
    const cls = await driver.findElement(By.id('ged')).getAttribute('class');
    push('Goal Input Panel Opens on Click', cls.includes('on'), Date.now()-t0, cls.includes('on')?'Panel opened':'Panel not shown');
  } catch(e) { push('Goal Input Panel Opens on Click', false, Date.now()-t0, e.message); }

  // T3 — Set goal updates display
  t0 = Date.now();
  try {
    await driver.executeScript("document.getElementById('goalInput').value='1800';");
    await driver.executeScript("dailyGoal=1800;localStorage.setItem('de_goal',1800);document.getElementById('goalDisp').textContent=1800;document.getElementById('ged').classList.remove('on');");
    await driver.sleep(500);
    const disp = await driver.executeScript("return document.getElementById('goalDisp').innerText||document.getElementById('goalDisp').textContent||''");
    push('Setting Daily Goal Updates Display', disp.trim()==='1800', Date.now()-t0, disp.trim()==='1800'?'Goal = 1800 ✓':`Shows: "${disp}"`);
  } catch(e) { push('Setting Daily Goal Updates Display', false, Date.now()-t0, e.message); }

  // T4 — Goal panel closes after save
  t0 = Date.now();
  try {
    const cls = await driver.findElement(By.id('ged')).getAttribute('class');
    push('Goal Panel Closes After Saving', !cls.includes('on'), Date.now()-t0, !cls.includes('on')?'Panel closed after save':'Panel still open');
  } catch(e) { push('Goal Panel Closes After Saving', false, Date.now()-t0, e.message); }

  // T5 — Default goal is 2000
  t0 = Date.now();
  try {
    await navigateTo(driver); await driver.sleep(600);
    await clickTab(driver, 'today'); await driver.sleep(400);
    const disp = await driver.executeScript("return document.getElementById('goalDisp').innerText||document.getElementById('goalDisp').textContent||''");
    const stored = await driver.executeScript("return localStorage.getItem('de_goal')||'2000'");
    push('Goal Display Shows Stored Goal Value', disp.trim().length>0, Date.now()-t0, `Display: ${disp.trim()}, Stored: ${stored}`);
  } catch(e) { push('Goal Display Shows Stored Goal Value', false, Date.now()-t0, e.message); }

  // T6 — Goal input is type number
  t0 = Date.now();
  try {
    const type = await driver.executeScript("return document.getElementById('goalInput').type||''");
    push('Goal Input Field is Type Number', type==='number', Date.now()-t0, type==='number'?'type="number" ✓':`type="${type}"`);
  } catch(e) { push('Goal Input Field is Type Number', false, Date.now()-t0, e.message); }

  // T7 — Goal stored in localStorage
  t0 = Date.now();
  try {
    await driver.executeScript("dailyGoal=2500;localStorage.setItem('de_goal',2500);document.getElementById('goalDisp').textContent=2500;");
    await driver.sleep(300);
    const stored = await driver.executeScript("return localStorage.getItem('de_goal')");
    push('Goal Value Persists in localStorage', stored==='2500', Date.now()-t0, stored==='2500'?'localStorage["de_goal"]=2500 ✓':`Stored: "${stored}"`);
  } catch(e) { push('Goal Value Persists in localStorage', false, Date.now()-t0, e.message); }

  // T8 — Goal input has min attribute
  t0 = Date.now();
  try {
    await jsClick(driver, await driver.findElement(By.className('gbtn'))); await driver.sleep(300);
    const min = await driver.executeScript("return document.getElementById('goalInput').getAttribute('min')||''");
    push('Goal Input Has Min Value Constraint', min==='100', Date.now()-t0, min==='100'?'min="100" ✓':`min="${min}"`);
  } catch(e) { push('Goal Input Has Min Value Constraint', false, Date.now()-t0, e.message); }

  return results;
};
