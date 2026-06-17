/**
 * TEST 06 — Goal Setting
 */
const { clickTab, findByText } = require('../utils/driver');

module.exports = async function runTests(driver) {
  const results = [];
  const push = (name, pass, dur, info) => results.push({
    name,
    status: pass ? 'PASS' : 'FAIL',
    duration: dur,
    category: 'Goal Setting',
    error: info,
    timestamp: Date.now()
  });

  const t0 = Date.now();
  try {
    // Navigate to Today screen
    await clickTab(driver, 'today');

    // Click Edit goal button (contentDescription="Edit goal")
    const editBtn = await driver.$('~Edit goal');
    await editBtn.waitForExist({ timeout: 5000 });
    await editBtn.click();
    await driver.pause(1000); // Wait for dialog animation

    // Find input in the dialog (only one EditText in the alert dialog is active)
    const inp = await driver.$('android.widget.EditText');
    await inp.setValue('2200');

    // Click Save button
    const saveBtn = await driver.$('android=new UiSelector().text("Save")');
    await saveBtn.click();
    await driver.pause(1000); // Wait for dialog to close

    // Verify goal text is updated (displays " / 2200 kcal")
    const goalLabel = await findByText(driver, ' / 2200 kcal');
    const pass = await goalLabel.isDisplayed();

    push('Change Daily Calorie Goal Updates UI', pass, Date.now() - t0, pass ? 'Calorie goal updated to 2200 kcal' : 'Updated goal text not found on Today screen');
  } catch (e) {
    push('Change Daily Calorie Goal Updates UI', false, Date.now() - t0, e.message);
  }

  return results;
};
