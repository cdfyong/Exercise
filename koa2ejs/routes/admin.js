var router=require('koa-router')();

router.get('/',async (ctx)=>{
    //ctx.body="Hello,welcome to test!";
    let title = 'Hello,这是一个测试的页面';
    
    await ctx.render('index',{
        title
    });
});

router.post('/user',async (ctx)=>{

    console.log(ctx.request.body);
    let loginName=ctx.request.body.loginName || "";
    let password=ctx.request.body.password || "";
    await ctx.render('login',{
        loginName,password
    });
    //ctx.body="test!"
});

router.post('/login',async (ctx)=>{
    // 以前的用法
//     var data=await common.getPostData(ctx);
//     console.log(data);
//    ctx.body=data;
  
    // koa的用法
    console.log(ctx.request.body);
    ctx.body=ctx.request.body;
    let loginName=ctx.request.body.loginName;
    let password=ctx.request.body.password;
    console.log(loginName);
    await ctx.render('show',{
        loginName,password
    });
});

router.post('/show',async (ctx)=>{
    console.log(ctx.request.body);
    let loginName=ctx.request.body.loginName || "";
    let password=ctx.request.body.password || "";
    console.log("show:"+loginName);
    console.log("show:"+password);
    await ctx.render('login',{
        loginName,password
    });
});

// router.get('/test',async (ctx)=>{
//     let title = '你好ejs';
//     let list = ['哈哈','嘻嘻','看看','问问'];
//     let content = "<h2>这是一个h2</h2>";
//     let num = 10;
//     await ctx.render('test',{
//         title,list,content,num
//     });
// });

module.exports=router;