const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Client } = require('@elastic/elasticsearch');
const { ElasticsearchClientError } = require('@elastic/elasticsearch/lib/errors');
const client = new Client({ 
  node: 'http://10.11.2.8:9201',
});

const test_query = {
  index: '.ds-logs-generic-default-2022.01.09-000001',
  // type: '_doc', // uncomment this line if you are using {es} ≤ 6
  body: {
    query: {
      match: { message: '2021-12-31' }
    },
    size: 3
  }
}

async function search (email) {
  const { body } = await client.search(test_query);
  console.log(body.hits.hits);
  return body.hits.hits;
}

router.get('/', (req, res) => {
  res.render('mypage', {
    title: 'マイページ',
    user: req.user,
  });
});

router.get('/list', (req, res) => {
  if (req.user) {
    search(req.user.email)
      .catch(console.log)
      .then(value => {
        if (value) {
          hits = value;
        } else {
          hits = ['該当するものはありません'];
        }
        console.log(hits);
        res.render('list', {
          title: 'リスト',
          user: req.user,
          hits: hits,
        });
      }); 
      
  } else {
    res.redirect('/users/login');
  }
})

module.exports = router;