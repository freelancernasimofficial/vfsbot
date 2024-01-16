import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const pathToExtension = path.join(__dirname, "2captcha");
// puppeteer usage as normal
puppeteer
  .launch({
    targetFilter: (target) => !!target.url(),
    ignoreHTTPSErrors: true,
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    userDataDir:
      "/Users/freelancernasim/Library/Application Support/Google/Chrome/Default",
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      `--proxy-server=185.199.231.45:8382`,
      // "--auto-open-devtools-for-tabs",
    ],
  })
  .then(async (browser) => {
    const page = (await browser.pages())[0];
    await page.authenticate({
      username: "rvoqlsin",
      password: "rilag3r6sd8m",
    });
    await page.setDefaultTimeout(300000);
    await page.setBypassCSP(true);

    await page.goto("https://visa.vfsglobal.com/npl/en/ltp/login");
    await page.locator("input#mat-input-0").fill("winbazilive@gmail.com");
    await page.locator("input#mat-input-1").fill("Mak223166@");
    await page.locator("form button").click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    const newBookingButton = await page.$(
      "button.mat-focus-indicator.btn.mat-btn-lg.btn-block.btn-brand-orange.mat-raised-button.mat-button-base",
    );
    await newBookingButton.evaluate((b) => b.click());
    // await page.screenshot({ path: Date.now() + ".jpg", fullPage: true });
    // await browser.close();
    console.log("all done");
  });
