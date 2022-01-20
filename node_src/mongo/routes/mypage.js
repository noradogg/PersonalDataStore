const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Client } = require('@elastic/elasticsearch');
const { ElasticsearchClientError } = require('@elastic/elasticsearch/lib/errors');
const client = new Client({ 
  node: 'http://10.11.2.8:9201',
});

/* GET /mypage */
router.get('/', (req, res) => {
  res.render('mypage', {
    title: 'マイページ',
    user: req.user,
  });
});

/** 学籍番号で検索し、最新のログ10個を取ってくる */
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
  }
}

/** メールアドレスから学籍番号を取得する */
async function search (email) {
  var student_number = email.split('@')[0];
  const { body } = await client.search(create_query(student_number));
  // console.log(body.hits.hits);
  return body.hits.hits;
}

/* GET /mypage/ocunet_log */
router.get('/ocunet_log', (req, res) => {
  if (req.user) {
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
      
  } else {
    res.redirect('/users/login');
  }
})

module.exports = router;