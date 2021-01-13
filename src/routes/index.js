let router = require('koa-better-router')().loadMethods();
const Helper = require('../Helper');
const model = require('../model');

router.get('/', async (ctx) => {
    let filter;
    try {
        filter = Helper.prepareFilter(ctx.query);
    } catch (e) {
        Helper.send400(ctx, e.message);
        return;
    }
    ctx.body = await model.getLessons(filter);
});

module.exports = router;
