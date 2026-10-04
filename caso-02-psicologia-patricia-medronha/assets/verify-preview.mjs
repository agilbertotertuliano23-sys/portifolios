// Local visual review helper; browser tooling is supplied by the workstation.
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const tooling = process.env.PREVIEW_BROWSER_TOOLING;
if (!tooling) throw new Error('Set PREVIEW_BROWSER_TOOLING to a module exporting puppeteer.');
const { puppeteer } = await import(pathToFileURL(tooling));
const output = new URL('./previews/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-webgl', '--enable-unsafe-swiftshader', '--no-first-run'] });
const page = await browser.newPage();
const errors = [], requests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('requestfailed', request => requests.push({ url: request.url(), error: request.failure()?.errorText }));
const report = { viewports: [], errors, requests };
try {
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL('desktop-hero.png', output).pathname.replace(/^\/(\w:)/, '$1') });
  await page.$eval('#atendimento', element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForFunction(() => document.querySelector('#laptop-stage').dataset.renderMode, { timeout: 25000 });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#laptop-stage canvas')).opacity === '1', { timeout: 10000 });
  report.laptop = await page.$eval('#laptop-stage', element => ({ mode: element.dataset.renderMode, canvas: !!element.querySelector('canvas'), width: element.clientWidth, height: element.clientHeight }));
  await page.screenshot({ path: new URL('desktop-therapy.png', output).pathname.replace(/^\/(\w:)/, '$1') });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: new URL('desktop-full.png', output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await new Promise(resolve => setTimeout(resolve, 150));
    report.viewports.push(await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, hasOverflow: document.documentElement.scrollWidth > innerWidth, headings: document.querySelectorAll('h1').length, brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src) })));
    if (width === 390) {
      await page.$eval('#atendimento', element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise(resolve => setTimeout(resolve, 400));
      await page.screenshot({ path: new URL('mobile-therapy.png', output).pathname.replace(/^\/(\w:)/, '$1') });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: new URL('mobile-full.png', output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
      await page.$eval('.testimonials-section', element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await page.click('[data-testimonial="1"]');
      await page.waitForFunction(() => document.querySelector('#testimonials-track').scrollLeft > 200);
      report.carousel = await page.$eval('.testimonials-status', element => element.textContent);
    }
  }
  await page.setViewport({ width: 1440, height: 1000 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.$eval('#laptop-stage', element => { element.scrollIntoView({ behavior: 'instant', block: 'center' }); element.focus(); });
  await page.keyboard.press('ArrowLeft');
  report.keyboard = await page.$eval('#laptop-stage', element => document.activeElement === element && element.dataset.renderMode === 'webgl');
  await page.click('.hero-cta-group [data-schedule]');
  report.scheduleTarget = await page.evaluate(() => location.hash);
  await page.goto('file:///C:/Users/agilb/web/psicologia-landing-page/index.html', { waitUntil: 'load' });
  await page.$eval('#atendimento', element => element.scrollIntoView({ behavior: 'instant' }));
  report.fileFallback = await page.$eval('.laptop-fallback', element => getComputedStyle(element).opacity === '1');
  await writeFile(new URL('report.json', output), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
