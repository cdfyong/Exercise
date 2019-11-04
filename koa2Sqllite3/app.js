const koa = require('koa');
const app = new koa();
var Sqlite = require('sqlite3').verbose();

var db = new Sqlite.Database('myDBtest.db');

var tablename = 'fyTestTable';

//table存不存在的判断 
var tableExist = ()=>{
    console.log('开始判断myDBtest DB存不存在');
    return new Promise((resolve, reject) => {
      try { 
        db.get('select count(*) as c from sqlite_master where type = ? and name = ?', ['table', tablename], (err,row) => { 
          if (row.c <= 0) {
            console.log('表不存在');
            resolve(false);
          } else {
            console.log('表存在');
            resolve(true); 
          }
        });
      } catch (err) { 
        console.log(err); 
        reject(false); 
      }  
    }); 
  }

  
//drop db
var droptable = ()=>{
    console.log('删除表开始：');
    return new Promise((resolve, reject) => {
      try {
        db.run(`DROP TABLE ${tablename}`, ()=> {
          resolve(console.log('删除表结束.'));
        });
      }catch (err) {
        reject(console.trace(err));
      }
    }); 
  }

  //create table
  var createtable = ()=>{
    console.log('创建表开始：');
    return new Promise((resolve, reject) => {
      try {
        db.run(`CREATE TABLE ${tablename} (userid TEXT,name TEXT)`, ()=>{
            resolve(console.log('创建表结束。'));
  
        });
  
      } catch (err) {
        reject(console.trace(err));
      } 
    }); 
  }

  //insert DB
var insertDB = ()=> {
    return new Promise((resolve, reject) => { 
      try {
  
        console.log('插入１００条数据开始：');
        let sqlstr = `INSERT INTO ${tablename} VALUES `; //不用拼接SQL直接用类似UpdateDB方法
        for (let i = 1; i <= 100; i++) {
          if(i<100){
            sqlstr+= `\n ('userid${i}', 'name${i}'),`;
          }else{
            sqlstr+= `\n ('userid${i}', 'name${i}')`;
          }
        } 
        // console.log(sqlstr); 
        db.run(sqlstr,()=>{
          resolve(console.log('插入１００条数据结束。')); 
        });
      } catch (error) {
        reject(console.trace(error));
      }
    });
  }
  
  
  
  //Search all Datas
  var searchDB = ()=>{
  
    console.log('查询数据开始：');
    return new Promise((resolve, reject) => {
      try {
        db.all(`SELECT rowid as id,userid , name as name FROM ${tablename} `, (err, rows) => {
          if (err) {
            reject(console.log(err));
          } else { 
            rows.forEach(function (row) {
              console.log(row.id + ': ' + row.userid + "/" + row.name);
            });
            console.log('查询并输出所有得data End...');
            resolve(rows);
          }
        });
      } catch (error) {
        reject(console.trace(error));
      }
    });
  }
  
  //update db
  var updateDB = ()=>{
    return new Promise((resolve, reject) => {
      try {
        console.log('更新数据开始：'); 
        let stmt = db.prepare(`UPDATE ${tablename} Set userid=?,name=? where rowid=?`); 
        for (let i = 1; i <= 100; i++) {
          stmt.run(['userid' + (i), 'name' + (i), i]);
        }
        stmt.finalize(()=>{
          resolve( console.log('更新数据完了。')); 
        }); 
      } catch (error) { 
        reject(console.trace(error)); 
      } 
    }); 
  }


// ＤＢ操作
db.serialize(async()=> {
    let flag = await tableExist();
    console.log("表存不存在的判断结果："+flag);
    if (flag) { 
      await droptable();
    }
  
    await createtable();

    console.log('插入１００条数据开始 insertDB():');
    await insertDB();

    console.log('插入１００条数据后查询 searchDB():');
    await searchDB();

    console.log('更新１００条数据開始 updateDB():');
    //因为是异步执行，保证更新完了后才回调查询输出
    // stmt.finalize(()=>{
    //resolve( console.log('更新１００条数据	End...'));
    // });
    await updateDB(); 
  
    console.log('更新１００条数据后查询 searchDB():');
    await searchDB();
  
    db.close();
  
  })
  
