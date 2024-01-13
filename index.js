import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
puppeteer
  .launch({
    targetFilter: (target) => !!target.url(),
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    userDataDir:
      "/Users/freelancernasim/Library/Application Support/Google/Chrome/Default",
  })
  .then(async (browser) => {
    const page = (await browser.pages())[0];
    await page.goto("https://visa.vfsglobal.com/npl/en/ltp/login");
    await page.locator("input#mat-input-0").fill("lokoxen748@duobp.com");
    await page.locator("input#mat-input-1").fill("ANi$h@0093");
    await page
      .locator("form button.btn.mat-btn-lg.btn-block.btn-brand-orange")
      .click();

    //   await page.screenshot({ path: "page.jpg", fullPage: true });
    console.log("all done");
  });
