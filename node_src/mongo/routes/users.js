const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', (req, res) => {
  /* 新規登録 */
  const { name, email, password } = req.body;
  let errors = [];

  if ( !name || !email || !password ) {
    errors.push({ msg: '入力されていない項目があります' });
  }
  if ( password.length < 6 ) {
    errors.push({ msg: 'パスワードは6文字以上にしてください' });
  }
  if ( errors.length > 0 ) {
    res.render('register', {
      errors, 
      name,
      email,
      password
    });
  } else {

    User
      .findOne({ email: email })
      .then(user => {
        if (user) {
          /* メアドが既存 */
          errors.push({ msg: 'そのメールアドレスはすでに登録されています' });
          res.render('register', {
            errors,
            name,
            email,
            password
          });
        } else {
          /* 登録 */
          const newUser = new User({
            name,
            email,
            password
          });
          /* パスワードのハッシュ化 */
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                throw err;
              }
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  // res.redirect('users/login');
                  res.send('新規登録完了しました');
                })
                .catch(err => console.log(err));
            })
          })

        }
    })
  }
})

module.exports = router;
