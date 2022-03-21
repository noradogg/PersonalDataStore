const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Client } = require('@elastic/elasticsearch');
const { ElasticsearchClientError } = require('@elastic/elasticsearch/lib/errors');
const client = new Client({ 
  node: 'http://10.11.2.8:9201',
});
const mongodb_db = require('../config/mongodb_db')
const MongoClient = require('mongodb').MongoClient;


/* GET /mypage */
router.get('/', (req, res) => {
  res.render('mypage', {
    title: 'マイページ',
    user: req.user,
  });
});

/** 学籍番号で検索し、最新のログ10個を取ってくるクエリ */
var create_query = (student_number) => {
  return {
    "index": '.ds-logs-generic-default-2022.01.09-000001',
    // type: '_doc', // uncomment this line if you are using {es} ≤ 6
    "body": {
      "query": {
        "match": { "message": student_number }
      },
      "size": 10,
      "sort": [{ 
        "@timestamp": { "order": "desc" } 
      }]
    }
  };
}

var get_student_number = email => email.split('@')[0];

/** メールアドレスから学籍番号を取得してそれをもとに検索 */
async function search (email) {
  const student_number = get_student_number(email);
  const { body } = await client.search(create_query(student_number));
  // console.log(body.hits.hits);
  return body.hits.hits;
}

/* GET /mypage/ocunet_log */
router.get('/ocunet_log', (req, res) => {
  if (!req.user) {
    res.redirect('/users/login');
  }

  search(req.user.email)
    .catch(console.log)
    .then(value => {
      if (value) {
        hits = value;
      } else {
        hits = ['該当するものはありません'];
      }
      res.render('list', {
        title: 'ネットワークログ',
        user: req.user,
        hits: hits,
      });
    }); 
  }
)

/* GET /mypage/data */
router.get('/data', async (req,res)=>{
  // ログインしていないとき、ログインページへリダイレクト
  if (!req.user) {
    res.redirect('/users/login');
  }

  const student_number = get_student_number(req.user.email);

  async function connect_mongo() {
    let processed_data;
    let client;

    console.log("---- connect mongodb server ---");

    try {
      // ../config/mongodb_dbからurl, options, db_name, collection_nameをインポートしてるので、それを使う
      client = await MongoClient.connect(mongodb_db.url, mongodb_db.options);
      console.log(" @@ Connected successfully to server @@ ")
      const db = client.db(mongodb_db.db_name);
      var collection = db.collection(mongodb_db.collection_name);

      try {
        let result = await collection
          .find({ "pds_user_id": student_number })  // 学籍番号( pds_user_id )をもとに、検索する
          .sort({ date:1 })
          .toArray()

        console.log("succeeded: select")
        console.log(result);
        collection_name = "filter_format" //filter_formatコレクションから整形方法を取得
        collection = db.collection(collection_name);
        
        /* JSON形式のデータを受け取って処理する関数 */
        /* => 処理したあとのデータ */
        async function get_format(result_jsn){
          try {

            format_result = await collection.find({"category":result_jsn.data_category}).toArray()
            //削除する「詳細」の項目を配列で取得
            for(category of format_result[0].projection_category){
              delete result_jsn.detail[category]
            }
            return result_jsn
          }
          catch(err) {
            console.log("err: format select")
            console.log(err)
            client.close()
          }
        }

        /* JSON形式のデータの配列を受け取って処理する関数 */
        /* => 処理したあとのデータの配列 */
        async function for_format(_result){
          var output = [];
          for(const result_jsn of _result){
            var jsn = await get_format(result_jsn)
            output.push(jsn);
          }
          return output;
        }

        processed_data = await for_format(result);
        return processed_data;
      }
      catch(err) {
        console.log("err: select")
        console.log(err)
        client.close()
      }
    }
    catch(err){
      console.log(" !! failed to connect mongo db server !! ")
      console.log(err)
    }
    finally{
      client.close()
    }
  }
  
  var get_jsn = await connect_mongo();

  let list = [];

  list.push(["日時","内容","詳細","情報カテゴリ","このデータを参照しているサービス"])//項目名
  for(i=0;i<get_jsn.length;i++){
    var list_jsn = []
    list_jsn.push(get_jsn[i].date)
    list_jsn.push(get_jsn[i].message)
    //詳細だけ個別の手順
    var s1=get_jsn[i].detail
    s1=JSON.stringify(s1)
    const j1 = JSON.parse(s1)
    const keyList = Object.keys(j1)
    var list_jsn_list = []
    for(j=0;j<keyList.length;j++){
      list_jsn_list.push(keyList[j]+': '+j1[keyList[j]])
    }
    //console.log(list_jsn_list)
    list_jsn.push(list_jsn_list)
    list_jsn.push(get_jsn[i].data_category)
    list_jsn.push(get_jsn[i].referring_service)
    list.push(list_jsn)
  }

  res.render('data', {
    title: 'data',
    list: list
  });
})


module.exports = router;