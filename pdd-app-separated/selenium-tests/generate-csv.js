/**
 * DietEase+ Selenium Test CSV Report Generator
 * Runs all tests and produces a clean, human-readable CSV
 */
const fs   = require('fs');
const path = require('path');
const { buildDriver } = require('./utils/driver');

const SITE_URL = 'https://dietease-plus.surge.sh';
const REPORTS  = path.join(__dirname, 'reports');
if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });

const TEST_FILES = [
  '01_page_load','02_navigation','03_barcode_lookup',
  '04_food_logging','05_delete_entry','06_goal_setting',
  '07_history','08_products','09_scan_mode','10_manual_entry'
];

(async () => {
  const driver = await buildDriver();
  const allResults = [];
  let sNo = 1;

  for (const file of TEST_FILES) {
    const label = file.replace(/_/g,' ').replace(/^\d+ /,'').toUpperCase();
    console.log(`▶ ${label}`);
    try {
      const mod = require(`./tests/${file}`);
      const results = await mod(driver);
      for (const r of results) {
        allResults.push({ sNo: sNo++, ...r });
        const icon = r.status === 'PASS' ? '✅' : '❌';
        console.log(`  ${icon} ${r.name} (${r.duration}ms)`);
      }
    } catch (e) {
      allResults.push({
        sNo: sNo++,
        name: `${label} — Suite Error`,
        status: 'FAIL',
        duration: 0,
        category: label,
        error: e.message,
        timestamp: Date.now()
      });
      console.log(`  ❌ Suite error: ${e.message}`);
    }
  }

  await driver.quit();

  // ── Compute summary ──────────────────────────────────────────
  const passed  = allResults.filter(r => r.status === 'PASS').length;
  const failed  = allResults.filter(r => r.status === 'FAIL').length;
  const total   = allResults.length;
  const passRate = ((passed / total) * 100).toFixed(1);
  const now = new Date();
  const dateStr = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // ── Build CSV content ────────────────────────────────────────
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const lines = [];

  // === SECTION 1: REPORT HEADER ===
  lines.push(`"DIETEASE+ — SELENIUM E2E TEST REPORT"`);
  lines.push(`"Generated",${esc(dateStr)}`);
  lines.push(`"Website",${esc(SITE_URL)}`);
  lines.push(`"Total Tests",${total}`);
  lines.push(`"Passed",${passed}`);
  lines.push(`"Failed",${failed}`);
  lines.push(`"Pass Rate","${passRate}%"`);
  lines.push(``);

  // === SECTION 2: SUMMARY BY CATEGORY ===
  lines.push(`"=== CATEGORY SUMMARY ==="`);
  lines.push(`"S.No","Category","Total","Passed","Failed","Pass Rate"`);

  const cats = {};
  for (const r of allResults) {
    const c = r.category || 'General';
    if (!cats[c]) cats[c] = { total: 0, passed: 0, failed: 0 };
    cats[c].total++;
    if (r.status === 'PASS') cats[c].passed++;
    else cats[c].failed++;
  }

  let catNo = 1;
  for (const [cat, s] of Object.entries(cats)) {
    const pr = ((s.passed / s.total) * 100).toFixed(0) + '%';
    lines.push([catNo++, esc(cat), s.total, s.passed, s.failed, esc(pr)].join(','));
  }
  lines.push(``);

  // === SECTION 3: DETAILED RESULTS ===
  lines.push(`"=== DETAILED TEST RESULTS ==="`);
  lines.push([
    esc('S.No'),
    esc('Test Name'),
    esc('Category'),
    esc('Status'),
    esc('Duration (ms)'),
    esc('Details / Error'),
    esc('Time')
  ].join(','));

  for (const r of allResults) {
    const time = new Date(r.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
    lines.push([
      r.sNo,
      esc(r.name),
      esc(r.category || 'General'),
      esc(r.status),
      r.duration,
      esc(r.error || ''),
      esc(time)
    ].join(','));
  }
  lines.push(``);

  // === SECTION 4: PASS / FAIL DETAIL ===
  const failures = allResults.filter(r => r.status === 'FAIL');
  lines.push(`"=== ${failures.length === 0 ? '✅ ALL TESTS PASSED — NO FAILURES' : 'FAILED TESTS DETAIL'} ==="`);
  if (failures.length > 0) {
    lines.push([esc('S.No'), esc('Test Name'), esc('Category'), esc('Error')].join(','));
    for (const r of failures) {
      lines.push([r.sNo, esc(r.name), esc(r.category || ''), esc(r.error || '')].join(','));
    }
  }

  // ── Write file ───────────────────────────────────────────────
  const stamp   = now.toISOString().replace(/[:.]/g,'-').slice(0,19);
  const csvFile = path.join(REPORTS, `dietease_report_${stamp}.csv`);
  // UTF-8 BOM so Excel opens it with correct encoding
  fs.writeFileSync(csvFile, '\uFEFF' + lines.join('\r\n'), 'utf8');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  📊 RESULTS SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Total Tests  : ${total}`);
  console.log(`  ✅ Passed     : ${passed}`);
  console.log(`  ❌ Failed     : ${failed}`);
  console.log(`  📈 Pass Rate  : ${passRate}%`);
  console.log(`\n✅ CSV Report saved:`);
  console.log(`   📁 ${csvFile}`);
  console.log(`\n   Open in Excel — fully readable, no binary!`);
})();
