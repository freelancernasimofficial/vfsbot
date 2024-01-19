import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import path from "path";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const pathToExtension = path.join(__dirname, "2captcha");

const loginURL = "https://visa.vfsglobal.com/npl/en/ltp/login";

async function startBot() {
  const browser = await puppeteer.launch({
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
      `--proxy-server=rp.proxyscrape.com:6060`,
      // "--auto-open-devtools-for-tabs",
    ],
  });

  const page = (await browser.pages())[0];
  await page.setBypassCSP(true);
  await page.authenticate({
    username: "uv3ythl4tgh9uu8",
    password: "m3dkgmvpwc5yq9y",
  });

  await page.goto("https://visa.vfsglobal.com/npl/en/ltp/login");

  const timer = setInterval(async () => {
    //start timer
    if ((await page.url()) === loginURL) {
      console.log(
        "process working for",
        await page.url(),
        Date.now() / 10000000,
      );

      const recaptcha = await page.$("form iframe[title='reCAPTCHA']");
      if (recaptcha) {
        console.log("recaptcha found relaunching");
        clearInterval(timer);
        await browser.close();
        return startBot();
      }

      const emailBox = await page.$("input#mat-input-0");
      const pwdBox = await page.$("input#mat-input-1");
      if (emailBox && pwdBox) {
        const isEmailEntered = await emailBox.evaluate(
          (el) => el?.value?.length,
        );
        const isPwdEntered = await emailBox.evaluate((el) => el?.value?.length);
        if (!isEmailEntered) {
          await emailBox.type("winbazilive@gmail.com");
          console.log("email entered");
        }
        if (!isPwdEntered) {
          await pwdBox.type("Mak223166@");
          console.log("password entered");
        }
      }

      const submitButton = await page.$("form button");
      if (submitButton) {
        await submitButton.click();
      }
    }

    if (
      (await page.url()) === "https://visa.vfsglobal.com/npl/en/ltp/dashboard"
    ) {
      console.log(
        "process working for",
        await page.url(),
        Date.now() / 10000000,
      );
      const gotoAppBtn = await page.$("button.mat-btn-lg");
      if (gotoAppBtn) {
        await gotoAppBtn.evaluate((btn) => btn.click());
      }
    }

    if (
      (await page.url()) ===
      "https://visa.vfsglobal.com/npl/en/ltp/application-detail"
    ) {
      console.log(
        "process working for",
        await page.url(),
        Date.now() / 10000000,
      );
      //check if ip blocked
      const getBlockAlert = await page.$("div.alert[role='alert'] span");
      if (getBlockAlert) {
        const blockAlertText = await getBlockAlert.evaluate(
          (el) => el.innerText,
        );
        if (blockAlertText.startsWith("Sorry you have encountered an error")) {
          console.log("ip blocked reloading");
          clearInterval(timer);
          await browser.close();
          return startBot();
        }
      }

      //start changing application category

      //get application category select option tag
      const selectApplicationCategoryTag = await page.$("#mat-select-4");

      //get selected span tag
      const selectedOptionSpanTag = await page.$(
        "#mat-select-4>div>div>span>span",
      );
      //Select option number 2 if not already selected
      if (!selectedOptionSpanTag) {
        if (selectApplicationCategoryTag) {
          //click options tag
          await selectApplicationCategoryTag.click();
          //get the option 2
          const appCatValue2 = await page.$("#mat-option-2");
          if (appCatValue2) {
            //click the option 2
            await appCatValue2.click();
            console.log("option 2 selected");
          }
        }
      }

      //if already selected
      // if (selectedOptionSpanTag) {
      //   const selectedText = await selectedOptionSpanTag.evaluate(
      //     (el) => el.innerText,
      //   );
      //   if (selectedText === "Lithuania Temporary Residence Permit") {
      //     await selectApplicationCategoryTag.click();
      //     //get the option 1
      //     const appCatValue1 = await page.$("#mat-option-1");
      //     if (appCatValue1) {
      //       //click the option 1
      //       await appCatValue1.click();
      //       console.log("option 1 selected");
      //     }
      //   }
      //   if (selectedText === "Lithuania National D Visa") {
      //     await selectApplicationCategoryTag.click();
      //     //get the option 1
      //     const appCatValue2 = await page.$("#mat-option-2");
      //     if (appCatValue2) {
      //       //click the option 1
      //       await appCatValue2.click();
      //       console.log("option 2 selected");
      //     }
      //   }
      // }

      //end application changing category
    }

    // await page.screenshot({ path: "page.jpg", fullPage: true });
  }, 500);
}

startBot();
