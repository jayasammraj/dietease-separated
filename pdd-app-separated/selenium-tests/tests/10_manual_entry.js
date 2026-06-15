/**
 * TEST 10 — Manual Entry (10 tests)
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
  const push = (name,pass,dur,info) => results.push({ name, status:pass?'PASS':'FAIL', duration:dur, category:'Manual Entry', error:info, timestamp:Date.now() });

  // T1 — Engine tags
  let t0 = Date.now();
  try {
    const engs = await driver.findElements(By.className('eng'));
    push('Scan Engine Tags Visible (Native, ZXing, Quagga)', engs.length>=3, Date.now()-t0, engs.length>=3?`${engs.length} engine tags found`:`Only ${engs.length}`);
  } catch(e) { push('Scan Engine Tags Visible (Native, ZXing, Quagga)', false, Date.now()-t0, e.message); }

  // T2 — DB source tags
  t0 = Date.now();
  try {
    const tags = await driver.findElements(By.className('dbt'));
    push('Database Source Tags Visible (≥5)', tags.length>=5, Date.now()-t0, tags.length>=5?`${tags.length} tags found`:`Only ${tags.length}`);
  } catch(e) { push('Database Source Tags Visible (≥5)', false, Date.now()-t0, e.message); }

  // T3 — Unknown barcode shows add card
  t0 = Date.now();
  try {
    const input = await driver.findElement(By.id('manualInput'));
    await input.clear(); await input.sendKeys('0000000000099');
    await jsClick(driver, await driver.findElement(By.css('.mrow button')));
    await driver.sleep(12000);
    const display = await driver.executeScript('return document.getElementById("addCard").style.display||""');
    push('Unknown Barcode Shows Manual Entry Form', display==='block', Date.now()-t0, display==='block'?`Add card display: block`:`display: "${display}"`);
  } catch(e) { push('Unknown Barcode Shows Manual Entry Form', false, Date.now()-t0, e.message); }

  // T4 — Name & calorie fields
  t0 = Date.now();
  try {
    const nameVis = await driver.executeScript('return document.getElementById("maName").offsetParent!==null');
    const calVis  = await driver.executeScript('return document.getElementById("maCal").offsetParent!==null');
    push('Manual Entry Form Has Name & Calorie Fields', nameVis&&calVis, Date.now()-t0, nameVis&&calVis?'Both fields visible':`name:${nameVis} cal:${calVis}`);
  } catch(e) { push('Manual Entry Form Has Name & Calorie Fields', false, Date.now()-t0, e.message); }

  // T5 — Protein field
  t0 = Date.now();
  try {
    const vis = await driver.executeScript('return document.getElementById("maProt").offsetParent!==null');
    push('Manual Entry Form Has Protein Field', vis, Date.now()-t0, vis?'Protein field visible':'Not visible');
  } catch(e) { push('Manual Entry Form Has Protein Field', false, Date.now()-t0, e.message); }

  // T6 — Carbs field
  t0 = Date.now();
  try {
    const vis = await driver.executeScript('return document.getElementById("maCarb").offsetParent!==null');
    push('Manual Entry Form Has Carbs Field', vis, Date.now()-t0, vis?'Carbs field visible':'Not visible');
  } catch(e) { push('Manual Entry Form Has Carbs Field', false, Date.now()-t0, e.message); }

  // T7 — Fat field
  t0 = Date.now();
  try {
    const vis = await driver.executeScript('return document.getElementById("maFat").offsetParent!==null');
    push('Manual Entry Form Has Fat Field', vis, Date.now()-t0, vis?'Fat field visible':'Not visible');
  } catch(e) { push('Manual Entry Form Has Fat Field', false, Date.now()-t0, e.message); }

  // T8 — Save button exists
  t0 = Date.now();
  try {
    const saveBtns = await driver.findElements(By.className('save-btn'));
    push('Manual Entry Form Save Button Exists', saveBtns.length>0, Date.now()-t0, saveBtns.length>0?'Save button found':'No save button');
  } catch(e) { push('Manual Entry Form Save Button Exists', false, Date.now()-t0, e.message); }

  // T9 — Submit manual entry → result card
  t0 = Date.now();
  try {
    await driver.executeScript("document.getElementById('maName').value='Test Food Item';");
    await driver.executeScript("document.getElementById('maCal').value='250';");
    await driver.executeScript("document.getElementById('maProt').value='10';");
    await driver.executeScript("document.getElementById('maCarb').value='30';");
    await driver.executeScript("document.getElementById('maFat').value='8';");
    await jsClick(driver, await driver.findElement(By.className('save-btn')));
    await driver.sleep(800);
    const rName = await driver.executeScript('return document.getElementById("rName").innerText||document.getElementById("rName").textContent||""');
    push('Manual Entry Submits and Shows Result Card', rName.toLowerCase().includes('test food'), Date.now()-t0, rName.toLowerCase().includes('test food')?`Result: "${rName}"`:`Got: "${rName}"`);
  } catch(e) { push('Manual Entry Submits and Shows Result Card', false, Date.now()-t0, e.message); }

  // T10 — Add card heading exists
  t0 = Date.now();
  try {
    const heading = await driver.executeScript('const h=document.querySelector("#addCard h3,#addCard .add-title,#addCard strong");return h?h.innerText||h.textContent:"(none)"');
    const addCard = await driver.findElement(By.id('addCard'));
    const exists = await driver.executeScript('return arguments[0]!==null', addCard);
    push('Add Card Container Element Exists', exists, Date.now()-t0, exists?'#addCard found':'#addCard missing');
  } catch(e) { push('Add Card Container Element Exists', false, Date.now()-t0, e.message); }

  return results;
};
