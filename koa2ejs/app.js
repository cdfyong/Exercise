// 引入koa
const koa = require('koa');
const app = new koa();

// 注意：引入的方式
const router = require('koa-router')();

const views = require('koa-views');

var bodyparser = require('koa-bodyparser');

// 引入子模块
var admin=require('./routes/admin.js');
    common=require('./module/common.js');

// 配置模版引擎中间件
// 如果这样配置不修改html后缀g改成ejs
app.use(views('views',{extension:'ejs'}));
// 如果这样配置不修改html后缀
// app.use(views('views',{map:{html:'ejs'}}));

app.use(bodyparser());

// 公共数据，每个路由里面都要该数据
app.use(async (ctx,next)=>{
    ctx.state = {
        userName:'张三'
    }
    // 继续向下匹配路由
    await next(); 
});


router.use('/admin',admin.routes());


// 作用:启动路由
app.use(router.routes());
// 作用:这是官方文档的推荐用法,我们可以看到 router.allowedMethords() 用在 router.routes() 之后,
// 所有,在当所有的路由中间件最后使用.此时根据 ctx.status 设置 response 响应头
app.use(router.allowedMethods());
                
// 监听端口≈
app.listen(3000,function(){
    console.log('启动成功');
});
