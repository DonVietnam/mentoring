require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const { errors } = require('puppeteer');
const utilsService = require('../services/utils.service');
const loggerService = require('../services/logger.service');

puppeteer.use(StealthPlugin());
puppeteer.use(AdBlockerPlugin({ blockTrackers: true }));
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: process.env.TWO_CAPTCHA_TOKEN,
    },
    visualFeedback: true,
  }),
);

module.exports = async function bookTickets(email, password, day, startTime, endTime, tickets) {
  tickets = utilsService.clamp(tickets, 1, 6);

  await loggerService.logInfo(`[NA BOOKING]: START (${day}, ${tickets}, ${startTime}, ${endTime})`);

  const browser = await lunchBrowser();
  const page = await browser.newPage();
  await setPageViewport(page, 1200, 900);

  try {
    await page.goto('https://www.recreation.gov');
    await login(page, email, password);
    await page.goto('https://www.recreation.gov/cart');
    await clearHistory(page);
    await page.goto('https://www.recreation.gov/ticket/234645/ticket/120');

    await inputBookingDay(page, day);
    await inputBookingTickets(page, tickets);
    const timeSlots = await getTimeSlots(page, startTime, endTime);

    if (!timeSlots) {
      await loggerService.logInfo('[NA BOOKING]: ALL TICKETS ARE BOOKED');
      return;
    }

    const totalAvailableTickets = getTotalAvailableTickets(timeSlots);
    const timeSlot = await getTimeSlot(timeSlots, tickets);

    await pickTimeSlot(page, timeSlot.id);
    await goToOrderDetailsPage(page);
    await solveCaptcha(page);
    await applyNeedToKnowInformation(page);
    await goToCartPage(page);
    await goToPaymentPage(page);

    const report = {
      day,
      availableTickets: totalAvailableTickets - tickets,
      bookedTickets: tickets,
    };
    await loggerService.logInfo(`[NA BOOKING]: ALL DONE ${day}`);
    return report;
  } catch (error) {
    if (error instanceof errors.TimeoutError) {
      return bookTickets(day, tickets, startTime, endTime);
    }
  } finally {
    await cleanup(page, browser);
  }
};

async function lunchBrowser() {
  return await puppeteer.launch({
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-dev-profile',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  });
}

async function cleanup(page, browser) {
  await page.close();
  await browser.close();
}

async function clearHistory(page) {
  await page.waitForTimeout(5000);
  const removeItemButtons = await page.$x("//button[contains(@title, 'Remove Reservation')]");

  for (const button of removeItemButtons) {
    await button.click();
    await page.waitForTimeout(1000);
    const [yesButton] = await page.$x("//button[contains(., 'Yes')]");
    await yesButton.click();
    await page.waitForTimeout(1000);
  }
  await loggerService.logInfo('[NA BOOKING]: CLEAR HISTORY');
}

async function setPageViewport(page, width, height) {
  await page.setViewport({
    width,
    height,
  });
}

async function login(page, email, password) {
  await page.waitForSelector('#ga-global-nav-log-in-link', { timeout: 1000 });
  await page.click('#ga-global-nav-log-in-link');
  await page.waitForSelector('.rec-acct-signin-modal input[type=email]', { timeout: 1000 });
  await page.type('.rec-acct-signin-modal input[type=email]', email);
  await page.waitForSelector('.rec-acct-signin-modal input[type=password]', { timeout: 1000 });
  await page.type('.rec-acct-signin-modal input[type=password]', password);
  await page.waitForSelector('.rec-acct-signin-modal button[type=submit]', { timeout: 1000 });
  await page.click('.rec-acct-signin-modal button[type=submit]');
  await page.waitForTimeout(2000);
}

async function inputBookingDay(page, day) {
  await page.waitForSelector('#tourCalendarWithKey', { timeout: 1000 });
  await page.type('#tourCalendarWithKey', day);
}

async function inputBookingTickets(page, tickets) {
  await page.waitForSelector('#guest-counter', { timeout: 1000 });
  await page.waitForTimeout(1000);
  await page.click('#guest-counter');
  await page.waitForTimeout(1000);
  await page.waitForSelector('#guest-counter-number-field-General\\ Admission', { timeout: 1000 });
  const guestField = await page.$('#guest-counter-number-field-General\\ Admission');
  await guestField.click();
  await guestField.press('Backspace');
  await guestField.type(tickets.toString());
  await page.click('#guest-counter-popup > div > div.sarsa-dropdown-base-popup-actions > div > button');
}

async function getTimeSlots(page, startTime, endTime) {
  await page.waitForSelector('.ti-radio-pill', { timeout: 1000 });
  return await page.evaluate(async (startTime, endTime) => await new Promise((resolve) => {
    const matchTime12 = (time12) => time12.match(/(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|A\.M\.|am|a\.m\.|PM|P\.M\.|pm|p\.m\.)/)[0]
      .split(/[\s:]+/);
    const getHours = (time12) => +matchTime12(time12)[0];
    const getMinutes = (time12) => +matchTime12(time12)[1];
    const getDateTime24 = (time12) => {
      const date = new Date();
      const minutes = getMinutes(time12);
      let hours = getHours(time12);
      const ampm = (hours !== 12) ? matchTime12(time12)[2] : '';
      hours += (ampm === 'PM') ? 12 : 0;

      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const isValidTime = (current12, start12, end12) => (getDateTime24(current12) > getDateTime24(start12)) && (getDateTime24(current12) < getDateTime24(end12));

    const timeSlots = document.querySelectorAll('input[type=radio].rec-sr-only');
    const validTimeSlots = [];

    for (const timeSlot of timeSlots) {
      const time = timeSlot.parentElement.querySelector('.ti-radio-pill-time').innerHTML;
      const availableTickets = +timeSlot.parentElement.querySelector('.ti-radio-pill-available')
        .innerHTML.match(/\d+/gm)[0];

      if (isValidTime(time, startTime, endTime)) {
        validTimeSlots.push({
          id: timeSlot.id,
          availableTickets,
        });
      }
    }
    resolve(validTimeSlots);
  }), startTime, endTime);
}

async function getTimeSlot(timeSlots, tickets) {
  do {
    const timeSlot = timeSlots.find((x) => x.availableTickets >= tickets);
    if (timeSlot) {
      return timeSlot;
    }
    tickets--;
  } while (tickets > 0);
}

async function pickTimeSlot(page, timeSlotId) {
  await page.waitForSelector(`label[for="${timeSlotId}"]`, { timeout: 1000 });
  await page.click(`label[for="${timeSlotId}"]`);
}

async function goToOrderDetailsPage(page) {
  const [requestTicketsButton] = await page.$x("//button[contains(., 'Request Tickets')]");
  await requestTicketsButton.click();
  await page.waitForTimeout(2000);
}

async function solveCaptcha(page) {
  await loggerService.logInfo('[NA BOOKING]: BEFORE CAPTCHA SOLVE');
  await page.solveRecaptchas();
  await loggerService.logInfo('[NA BOOKING]: AFTER CAPTCHA SOLVE');
  const [closeCaptchaButton] = await page.$x("//button[contains(., 'Continue Booking')]");
  if (closeCaptchaButton) {
    await closeCaptchaButton.click();
  }
}

async function applyNeedToKnowInformation(page) {
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    document.querySelector('label[for="need-to-know-checkbox"]').click();
  });
  await loggerService.logInfo('[NA BOOKING]: APPLY NEED TO KNOW INFORMATION');
}

async function goToCartPage(page) {
  await page.click('.sarsa-button-primary');
  await loggerService.logInfo('[NA BOOKING]: CLICK TO PROCEED TO CART BUTTON');
}

async function goToPaymentPage(page) {
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const button = document.querySelector('.rec-button-primary-large');
    button.click();
  });
  await loggerService.logInfo('[NA BOOKING]: PAYMENT PAGE');
}

function getTotalAvailableTickets(timeSlots) {
  return timeSlots.reduce((acc, curr) => acc + curr.availableTickets, 0);
}
