/**
 * TEST 01 — Page Load (10 tests)
 */
const { navigateTo, By } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  await navigateTo(driver);
  await driver.sleep(800);

  const t = (name, category, fn) => async () => {
    const t0 = Date.now();
    try { await fn(); }
    catch(e) { results.push({ name, status:'FAIL', duration:Date.now()-t0, category, error:e.message, timestamp:Date.now() }); return; }
  };

  // T1
  let t0 = Date.now();
  try {
    const title = await driver.getTitle();
    const pass = title.includes('DietEase');
    results.push({ name:'Page Title Contains "DietEase"', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?`Title: "${title}"`:`Got: "${title}"`, timestamp:Date.now() });
  } catch(e) { results.push({ name:'Page Title Contains "DietEase"', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T2
  t0 = Date.now();
  try {
    const logo = await driver.executeScript('return document.querySelector(".logo").innerText || document.querySelector(".logo").textContent || ""');
    const pass = logo.includes('DietEase');
    results.push({ name:'Logo Text Visible (DietEase+)', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?`Logo: "${logo.trim()}"`:`Got: "${logo}"`, timestamp:Date.now() });
  } catch(e) { results.push({ name:'Logo Text Visible (DietEase+)', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T3
  t0 = Date.now();
  try {
    const tabs = await driver.findElements(By.className('nav-tab'));
    const pass = tabs.length >= 4;
    results.push({ name:'Navigation Bar Has 4 Tabs', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?`${tabs.length} tabs found`:`Only ${tabs.length} tabs`, timestamp:Date.now() });
  } catch(e) { results.push({ name:'Navigation Bar Has 4 Tabs', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T4
  t0 = Date.now();
  try {
    const badge = await driver.executeScript('const b=document.querySelector(".badge");return b?b.innerText||b.textContent:"";');
    const pass = badge.includes('BARCODE');
    results.push({ name:'Badge Label Visible (BARCODE SCANNER)', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?`Badge: "${badge.trim()}"`:badge, timestamp:Date.now() });
  } catch(e) { results.push({ name:'Badge Label Visible (BARCODE SCANNER)', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T5 — Meta description
  t0 = Date.now();
  try {
    const desc = await driver.executeScript('const m=document.querySelector("meta[name=description]");return m?m.getAttribute("content"):"";');
    const pass = desc && desc.length > 10;
    results.push({ name:'Meta Description Tag Present', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?`Description: "${desc.substring(0,60)}…"`:'No meta description', timestamp:Date.now() });
  } catch(e) { results.push({ name:'Meta Description Tag Present', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T6 — Theme color
  t0 = Date.now();
  try {
    const color = await driver.executeScript('const m=document.querySelector("meta[name=theme-color]");return m?m.getAttribute("content"):"";');
    const pass = color && color.length > 0;
    results.push({ name:'Theme Color Meta Tag Present', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?`Color: "${color}"`:'No theme-color meta', timestamp:Date.now() });
  } catch(e) { results.push({ name:'Theme Color Meta Tag Present', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T7 — lang attribute
  t0 = Date.now();
  try {
    const lang = await driver.executeScript('return document.documentElement.getAttribute("lang") || "";');
    const pass = lang === 'en';
    results.push({ name:'HTML lang Attribute is "en"', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?'lang="en"':`lang="${lang}"`, timestamp:Date.now() });
  } catch(e) { results.push({ name:'HTML lang Attribute is "en"', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T8 — viewport meta
  t0 = Date.now();
  try {
    const vp = await driver.executeScript('const m=document.querySelector("meta[name=viewport]");return m?m.getAttribute("content"):"";');
    const pass = vp.includes('width=device-width');
    results.push({ name:'Viewport Meta Tag Exists', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?'Viewport meta found':'No viewport meta', timestamp:Date.now() });
  } catch(e) { results.push({ name:'Viewport Meta Tag Exists', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T9 — dark background
  t0 = Date.now();
  try {
    const bg = await driver.executeScript('return getComputedStyle(document.body).backgroundColor;');
    // Dark = rgb with low values
    const pass = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== '';
    results.push({ name:'Body Has Dark Background Color', status:pass?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:pass?`BG: ${bg}`:'No background color', timestamp:Date.now() });
  } catch(e) { results.push({ name:'Body Has Dark Background Color', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  // T10 — Google Fonts
  t0 = Date.now();
  try {
    const fonts = await driver.executeScript('return [...document.querySelectorAll("link[rel=stylesheet]")].some(l=>l.href.includes("fonts.googleapis.com"));');
    results.push({ name:'Google Fonts Stylesheet Loaded', status:fonts?'PASS':'FAIL', duration:Date.now()-t0, category:'Page Load', error:fonts?'Google Fonts link found':'No Google Fonts link', timestamp:Date.now() });
  } catch(e) { results.push({ name:'Google Fonts Stylesheet Loaded', status:'FAIL', duration:Date.now()-t0, category:'Page Load', error:e.message, timestamp:Date.now() }); }

  return results;
};
