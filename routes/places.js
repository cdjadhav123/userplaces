var express = require('express');
const controller = require('../controllers/location');
var router = express.Router();
const validateToken = require('../utils').validateToken;

/* GET home page. */

router.route('/')
    .post(validateToken,controller.places);

module.exports = router;