var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');
const validateToken = require('../utils').validateToken;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.route('/')
    .post(controller.add)
    .get(validateToken,controller.getAll);

router.route('/login')
    .post(controller.login);

module.exports = router;
