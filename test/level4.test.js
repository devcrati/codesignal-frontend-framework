import { expect } from "chai";
import puppeteer from "puppeteer";

describe("CRM System - Level 4", function () {
  let browser;
  let page;

  before(async function () {
    this.timeout(10000);
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(10000);
    await page.goto("http://localhost:5173", {
      waitUntil: "networkidle0",
    });
    // await page.waitForNetworkIdle({ idleTime: 2000, timeout: 5000 });
  });

  after(async function () {
    if (browser) {
      await browser.close();
    }
  });

  const getCustomerName = async (customer) =>
    customer.$eval("h3", (el) => el.innerText);

  const getCustomerLoyaltyPoints = async (customer) =>
    (
      await customer.$$eval(
        ".customer__stats .stats .stats__number",
        (elements) => elements.map((e) => e.innerText)
      )
    )[0];

  const getCustomerNumberOfPurchases = async (customer) =>
    (
      await customer.$$eval(
        ".customer__stats .stats .stats__number",
        (elements) => elements.map((e) => e.innerText)
      )
    )[1];

  const getCustomerEmail = async (customer) =>
    customer.$eval(".customer__email", (el) => el.innerText);

  const getCustomerPhoneNumber = async (customer) =>
    customer.$eval(".customer__phone-number", (el) => el.innerText);

  const getCustomerPersonalManager = async (customer) =>
    customer.$eval(".customer__personal-manager", (el) => el.innerText);

  const setInputValue = async (selector, text) => {
    const input = await page.$(selector);
    await input.click({ clickCount: 3 });
    if (text.length === 0) {
      await page.keyboard.press("Backspace");
    } else if (text.length < 10) {
      await input.type(text);
    } else {
      await page.$eval(
        selector,
        (el, value) => (el.value = value),
        text.slice(0, -1)
      );
      await page.type(selector, text.slice(-1));
    }
  };

  const setFirstNameInputValue = async (text) =>
    setInputValue('.customer-edit-form input[name="firstName"]', text);

  const getFirstNameInputValue = async () =>
    page.$eval('.customer-edit-form input[name="firstName"]', (el) => el.value);

  const setLastNameInputValue = async (text) =>
    setInputValue('.customer-edit-form input[name="lastName"]', text);

  const getLastNameInputValue = async () =>
    page.$eval('.customer-edit-form input[name="lastName"]', (el) => el.value);

  const setEmailInputValue = async (text) =>
    setInputValue('.customer-edit-form input[name="email"]', text);

  const getEmailInputValue = async () =>
    page.$eval('.customer-edit-form input[name="email"]', (el) => el.value);

  const setPhoneNumberInputValue = async (text) =>
    setInputValue('.customer-edit-form input[name="phoneNumber"]', text);

  const getPhoneNumberInputValue = async () =>
    page.$eval(
      '.customer-edit-form input[name="phoneNumber"]',
      (el) => el.value
    );

  it('level 4 - should display "Edit" button', async function () {
    await page.waitForSelector(".customers-container .customer", {
      visible: true,
      timeout: 2000,
    });
    const customers = await page.$$(".customers-container .customer");

    for (const customer of customers) {
      expect(
        !!(await customer.$(".customer__edit-btn")),
        '"Edit" button should be displayed'
      ).to.be.true;
    }
  });

  it('level 4 - should switch to edit view upon "Edit" button click', async function () {
    this.timeout(3000);
    let customers = await page.$$(".customers-container .customer");
    expect(customers.length).to.be.equal(14);

    expect(await getCustomerName(customers[2])).to.be.equal("Anna Dunn");
    expect(await getCustomerLoyaltyPoints(customers[2])).to.be.equal("910");
    expect(await getCustomerNumberOfPurchases(customers[2])).to.be.equal("4");
    expect(await getCustomerEmail(customers[2])).to.be.equal(
      "anna1984@gmail.com"
    );
    expect(await getCustomerPhoneNumber(customers[2])).to.be.equal(
      "303-297-8468"
    );

    await (await customers[2].$(".customer__edit-btn")).click();
    await new Promise((r) => setTimeout(r, 200));

    await page.waitForSelector(".customers-container .customer--edit", {
      visible: true,
      timeout: 1000,
    });
    customers = await page.$$(".customers-container .customer");
    expect(customers.length).to.be.equal(13);
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 2000 });

    const customerToBeUpdated = await page.$(
      ".customers-container .customer--edit"
    );
    expect(
      !!customerToBeUpdated,
      "There should be 1 customer card in the edit view"
    ).to.be.true;

    expect(
      await customerToBeUpdated.$eval(
        '.customer-edit-form input[name="firstName"]',
        (el) => el.value
      )
    ).to.be.equal("Anna");

    expect(
      await customerToBeUpdated.$eval(
        '.customer-edit-form input[name="lastName"]',
        (el) => el.value
      )
    ).to.be.equal("Dunn");
    expect(
      await customerToBeUpdated.$eval(
        '.customer-edit-form input[name="email"]',
        (el) => el.value
      )
    ).to.be.equal("annal1984@gmail.com");
    expect(
      await customerToBeUpdated.$eval(
        '.customer-edit-form input[name="phoneNumber"]',
        (el) => el.value
      )
    ).to.be.equal("303-297-8468");

    try {
      await page.waitForFunction(
        'document.querySelector(".customer-edit-form select option:checked").innerHTML === "Bryce Hammond"',
        { timeout: 1000 }
      );
    } catch (e) {
      expect.fail(
        '"Assign personal manager" dropdown in the Edit View should be preselected with the current personal manager "Bryce Hammond"'
      );
    }

    expect(
      await customerToBeUpdated.$eval(
        ".customer-edit-form select option:checked",
        (e) => e.innerText
      )
    ).to.be.equal("Bryce Hammond");
    const options = await customerToBeUpdated.$$eval(
      ".customer-edit-form select option",
      (nodes) => nodes.map((n) => n.innerHTML)
    );

    expect(options.length).to.be.equal(13);
    expect(options[0]).to.be.equal("");
    expect(options[1]).to.be.equal("Philip Hilton");
    expect(options[2]).to.be.equal("Lynda Olson");
    expect(options[3]).to.be.equal("Donovan Marsh");
    expect(options[4]).to.be.equal("Ivy Richmond");
    expect(options[5]).to.be.equal("Thelma Drew");
    expect(options[6]).to.be.equal("Byron Higgs");
    expect(options[7]).to.be.equal("Lisa Lake");
    expect(options[8]).to.be.equal("Alina Gray");
    expect(options[9]).to.be.equal("Delaney Mills");
    expect(options[10]).to.be.equal("Troy Fowler");
    expect(options[11]).to.be.equal("Taylor Ramos");
    expect(options[12]).to.be.equal("Bryce Hammond");
  });
});
