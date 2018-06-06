const router = require('koa-router')()
const { Meta } = require('../models')
const fetchCritical = require('../lib/fetch_critical')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    body: 'criticalCss'
  })
})

router.get('/critical', async (ctx, next) => {
  const key = ctx.request.query.key || ctx.request.querystring
  const meta = await Meta.findOne({ where: { key: key } })

  if (!meta) {
    fetchCritical(ctx.request.query, key)
  }

  ctx.body = meta ? meta.get('value') : ''
})

module.exports = router
