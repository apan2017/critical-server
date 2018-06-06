const penthouse = require('penthouse')
const puppeteer = require('puppeteer')
const axios = require('axios')
const { Meta } = require('../models')
const { info } = require('./log_util')

const _PROCESS = {}
const _Timeout = 120000

async function getStyleSheets(browser, url, params) {
  const page = await browser.newPage()
  await page.goto(url, {timeout: params.timeout, waitUntil: 'networkidle2'})
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

module.exports = async function(params, key) {
  if (_PROCESS[key]) { return }
  _PROCESS[key] = true

  const url = params['url']

  params.timeout = params.timeout ? +params.timeout : _Timeout

  info(`Starting deal with => ${url}`)

  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ['--disable-setuid-sandbox', '--no-sandbox']
  })

  info(`Stylesheets is Downloading...`)
  const stylesheets = await getStyleSheets(browser, url, params)
  const sheetContent = await fetchStyleheetContent(stylesheets)
  info(`Stylesheets is ready.`)

  const penthouseParams = Object.assign(params, {
    cssString: sheetContent,
    puppeteer: {
      getBrowser: () => browser
    }
  })

  info(`Critical Css is Downloading...`)
  const criticalCss = await penthouse(penthouseParams)
  info(`Critical Css is ready.`)

  const meta = await Meta.findOne({ where: {key: key} })
  if (meta) {
    await meta.update({value: criticalCss})
  } else {
    await Meta.create({key: key, value: criticalCss})
  }

  await browser.close
  info(`Browser closed...`)

  delete _PROCESS[key]

  return criticalCss
}
