const penthouse = require('penthouse')
const puppeteer = require('puppeteer')
const axios = require('axios')

async function getStyleSheets(browser, url) {
  const page = await browser.newPage()
  await page.goto(url, {timeout: 120000, waitUntil: 'networkidle2'})
  const result = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(t => t.href)
  })
  return result
}

async function fetchStyleheetContent(stylesheets) {
  let sheetContent = await Promise.all(stylesheets.map(async (link) => {
    const response = await axios.get(link)
    return response.data
  }))
  sheetContent = sheetContent.join('')
  return sheetContent
}

module.exports = async function(url, params) {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ['--disable-setuid-sandbox', '--no-sandbox']
  })

  const stylesheets = await getStyleSheets(browser, url)
  const sheetContent = await fetchStyleheetContent(stylesheets)

  const criticalCss = await penthouse({
    url: url,
    cssString: sheetContent,
    timeout: 120000,
    puppeteer: {
      getBrowser: () => browser
    }
  })

  await browser.close

  return criticalCss
}
