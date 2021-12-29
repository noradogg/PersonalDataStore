const express = require('express');
// const User = require('../models/User');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
    // console.log(req.session);
    res.render('mypage', {user: req.user});
});

module.exports = router;