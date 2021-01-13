const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const lg = require('./logger');
const routes = require('./routes');

app.use(koaBody());
app.use( routes.middleware());
/*
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    lg.debug(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.get("/", async ctx => {
    lg.debug(`Hello from context`);
    ctx.body = {
        status: 'success',
        message: 'hello, world!'
    };
});

*/
app.on('error', (e) => {
    lg.error(e);
});

module.exports = app;
