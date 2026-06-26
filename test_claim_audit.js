const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to https://scrutexity.com/claim-audit...");
  try {
    await page.goto('https://scrutexity.com/claim-audit', { waitUntil: 'networkidle' });
  } catch (err) {
    console.error("Failed to load page:", err);
    await browser.close();
    process.exit(1);
  }

  console.log("Page loaded. Searching for input field...");
  
  // Try to find the input field. It's probably an input of type url or text.
  const inputSelector = 'input[type="url"], input[type="text"], input[name="domain"], input[name="url"], input[placeholder*="domain"]';
  
  try {
    await page.waitForSelector(inputSelector, { timeout: 5000 });
    await page.fill(inputSelector, 'example.com');
    console.log("Filled 'example.com'. Searching for submit button...");
    
    // Press enter or find submit button
    await page.keyboard.press('Enter');
    
    console.log("Submitted. Waiting for results (up to 60s)...");
    
    // Wait for some loading state to appear and disappear, or for results to appear
    // We'll just wait for any new text that indicates success or failure
    // A timeout here means it hung.
    try {
      await page.waitForFunction(() => {
        return document.body.innerText.includes('Report') || 
               document.body.innerText.includes('Found') || 
               document.body.innerText.includes('Error') ||
               document.body.innerText.includes('Analysis') ||
               document.body.innerText.includes('Complete');
      }, { timeout: 60000 });
      console.log("Report or result text found!");
      
      const content = await page.evaluate(() => document.body.innerText);
      console.log("--- RESULT SUMMARY ---");
      console.log(content.substring(0, 500) + '...');
    } catch (err) {
      console.log("Timed out waiting for report. It might have hung.");
    }

  } catch (err) {
    console.log("Could not find the input field. Page content preview:");
    const content = await page.evaluate(() => document.body.innerText);
    console.log(content.substring(0, 1000));
  }
  
  await browser.close();
})();
