const router = require('koa-router')()
const fetchCritical = require('../lib/fetch_critical')

router.get('/', async (ctx, next) => {
  let criticalCss = await fetchCritical('https://www.theknot.com/content')

  await ctx.render('index', {
    title: 'Hello Koa 2!',
    body: criticalCss
  })
})



module.exports = router
