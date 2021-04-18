const express = require('express');
const router = express.Router();

// Controllers
const menuController = require('../controllers/menu');

router.get('/menu', menuController.getMenu);

module.exports = router;
