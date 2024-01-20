import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import path from "path";
import * as url from "url";
import person from "./person.js";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const pathToExtension = path.join(__dirname, "2captcha");

const loginURL = "https://visa.vfsglobal.com/npl/en/ltp/login";
let dateFindingFormPassed = false;

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

    //check if ip blocked
    const getBlockAlert = await page.$("div.alert[role='alert'] span");
    if (getBlockAlert) {
      const blockAlertText = await getBlockAlert.evaluate((el) => el.innerText);
      if (blockAlertText.startsWith("Sorry you have encountered an error")) {
        console.log("ip blocked reloading");
        clearInterval(timer);
        await browser.close();
        return startBot();
      }
    }
    if (
      (await page.url()) ===
      "https://visa.vfsglobal.com/npl/en/ltp/page-not-found"
    ) {
      console.log("page not found relaunching");
      clearInterval(timer);
      await browser.close();
      return startBot();
    }

    if ((await page.url()) === loginURL) {
      //check if recaptcha found
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
        await submitButton?.evaluate((el) => el.click());
      }
    }

    if (
      (await page.url()) === "https://visa.vfsglobal.com/npl/en/ltp/dashboard"
    ) {
      const gotoAppBtn = await page.$("button.mat-btn-lg");
      if (gotoAppBtn) {
        await gotoAppBtn.evaluate((btn) => btn?.click());
      }
    }

    if (
      (await page.url()) ===
      "https://visa.vfsglobal.com/npl/en/ltp/application-detail"
    ) {
      //start changing application category

      //get application category select option tag
      const selectApplicationCategoryTag = await page.$("#mat-select-4");

      //get selected span tag
      const selectedOptionSpanTag = await page.$(
        "#mat-select-4>div>div>span>span",
      );

      //Select option number 1 if not already selected
      if (!selectedOptionSpanTag) {
        if (selectApplicationCategoryTag) {
          //click options tag
          await selectApplicationCategoryTag?.evaluate((el) => el.click());
          //get the option 1
          const appCatValue2 = await page.$("#mat-option-2");
          if (appCatValue2) {
            //click the option 1
            await appCatValue2?.click();
            console.log("option 2 selected first time");
          }
        }
      }
      if (selectedOptionSpanTag) {
        const selectedOptionText = await selectedOptionSpanTag.evaluate(
          (el) => el.innerText,
        );

        if (selectedOptionText === "Lithuania Temporary Residence Permit") {
          const alertTag = await page.$("form div.alert.alert-info");
          if (alertTag) {
            const alertText = await alertTag.evaluate((el) => el.innerText);
            console.log(alertText);
            if (alertText.startsWith("We are sorry")) {
              //click options tag
              await selectApplicationCategoryTag?.click();
              //get the option 1
              const appCatValue1 = await page.$("#mat-option-1");
              if (appCatValue1) {
                //click the option 1
                await appCatValue1?.click();
              }
            }
          }
        }

        if (selectedOptionText === "Lithuania National D Visa") {
          const alertTag = await page.$("form div.alert.alert-info");
          if (alertTag) {
            const alertText = await alertTag.evaluate((el) => el.innerText);
            console.log(alertText);

            if (alertText.startsWith("Earliest available")) {
              const subCategoryOption = await page.$("#mat-select-2");
              const selectedSubOptionSpanTag = await page.$(
                "#mat-select-2>div>div>span>span",
              );
              if (!selectedSubOptionSpanTag && subCategoryOption) {
                await subCategoryOption?.click();
                const getSubOption = await page.$("#mat-option-4");

                if (getSubOption) {
                  await getSubOption?.click();
                }
              }

              const continueButton = await page.$(
                "form button.mat-btn-lg.btn-brand-orange[type='button']",
              );

              if (
                selectedSubOptionSpanTag &&
                continueButton &&
                !dateFindingFormPassed
              ) {
                console.log("click continue");
                await continueButton?.evaluate((el) => el.click());
                dateFindingFormPassed = true;
              }
            }

            //   await selectApplicationCategoryTag?.click();
            // //get the option 2
            // const appCatValue2 = await page.$("#mat-option-2");
            // if (appCatValue2) {
            //   //click the option 2
            //   await appCatValue2?.click();
            // }
          }
        }
      }

      //end application changing category
    }
    //ended date finding page

    //start details page
    if (
      (await page.url()) ===
      "https://visa.vfsglobal.com/npl/en/ltp/your-details"
    ) {
      console.log("process for details", Date.now().toString().substring(6));
      const migrisApplicationNumberInput = await page.$("input#mat-input-2");
      const firstNameInput = await page.$("input#mat-input-3");
      const lastNameInput = await page.$("input#mat-input-4");
      const passportNumberInput = await page.$("input#mat-input-5");
      const contactNumberCountryCodeInput = await page.$("input#mat-input-6");
      const contactNumberInput = await page.$("input#mat-input-7");
      const emailInput = await page.$("input#mat-input-8");
      const dateOfBirthInput = await page.$("input#dateOfBirth");
      const passportExpireDateInput = await page.$("input#passportExpirtyDate");

      if (
        migrisApplicationNumberInput &&
        firstNameInput &&
        lastNameInput &&
        passportNumberInput &&
        contactNumberCountryCodeInput &&
        contactNumberInput &&
        emailInput &&
        dateOfBirthInput &&
        passportExpireDateInput
      ) {
        const migrisApplicationNumberInputLength =
          await migrisApplicationNumberInput.evaluate((el) => el.value.length);
        if (!migrisApplicationNumberInputLength) {
          await migrisApplicationNumberInput.type(
            person.migris_application_number,
          );
        }
        const firstNameInputLength = await firstNameInput.evaluate(
          (el) => el.value.length,
        );
        if (!firstNameInputLength) {
          await firstNameInput.type(person.first_name);
        }

        const lastNameInputLength = await lastNameInput.evaluate(
          (el) => el.value.length,
        );
        if (!lastNameInputLength) {
          await lastNameInput.type(person.last_name);
        }

        const passportNumberInputLength = await passportNumberInput.evaluate(
          (el) => el.value.length,
        );
        if (!passportNumberInputLength) {
          await passportNumberInput.type(person.passport_number);
        }

        const contactNumberCountryCodeInputLength =
          await contactNumberCountryCodeInput.evaluate((el) => el.value.length);
        if (!contactNumberCountryCodeInputLength) {
          await contactNumberCountryCodeInput.type(
            person.phone_number_country_code,
          );
        }

        const contactNumberInputLength = await contactNumberInput.evaluate(
          (el) => el.value.length,
        );
        if (!contactNumberInputLength) {
          await contactNumberInput.type(person.phone_number);
        }

        const emailInputLength = await emailInput.evaluate(
          (el) => el.value.length,
        );
        if (!emailInputLength) {
          await emailInput.type(person.email);
        }

        const dateOfBirthInputLength = await dateOfBirthInput.evaluate(
          (el) => el.value.length,
        );
        if (!dateOfBirthInputLength) {
          await dateOfBirthInput.type(person.dob);
        }

        const passportExpireDateInputLength =
          await passportExpireDateInput.evaluate((el) => el.value.length);
        if (!passportExpireDateInputLength) {
          await passportExpireDateInput.type(person.passport_expire_date);
        }

        //select option gender
        const genderOption = await page.$("#mat-select-6");
        const selectedGenderSpanTag = await page.$(
          "#mat-select-6>div>div>span>span",
        );
        if (!selectedGenderSpanTag && genderOption) {
          //open gender popup
          await genderOption?.evaluate((el) => el?.click());
          const getGenderMale = await page.$(
            "div#mat-select-6-panel .mat-option:nth-child(2)",
          );
          const getGenderFemale = await page.$(
            "div#mat-select-6-panel .mat-option:nth-child(1)",
          );
          if (getGenderMale && getGenderFemale) {
            if (person.gender.toLocaleLowerCase() === "male") {
              await getGenderMale?.click();
            }
            if (person.gender.toLocaleLowerCase() === "female") {
              await getGenderFemale?.click();
            }
          }
        }

        //nationality
        if (selectedGenderSpanTag) {
          const nationalityOption = await page.$("#mat-select-8");
          const selectedNationalitySpanTag = await page.$(
            "#mat-select-8>div>div>span>span",
          );
          if (!selectedNationalitySpanTag && nationalityOption) {
            await nationalityOption?.click();
            const nationality = await page.$(
              "div#mat-select-8-panel .mat-option:nth-child(148)",
            );
            if (nationality) {
              await nationality?.click();
            }
          }
        }
        //nationality end
      }
    }
    //end details page

    // await page.screenshot({ path: "page.jpg", fullPage: true });
  }, 300);
}

startBot();
