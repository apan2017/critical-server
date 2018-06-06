const router = require('koa-router')()
const { Meta } = require('../models')
const fetchCritical = require('../lib/fetch_critical')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    body: 'criticalCss'
  })
})

module.exports = router
