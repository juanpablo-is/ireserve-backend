const express = require('express');
const router = express.Router();

// Controladores
const menuController = require('../controllers/menu');
const restaurantController = require('../controllers/restaurant');
const userController = require('../controllers/user');

/**
 * Rutas REST para menu.
 */
router.get('/menu', menuController.getMenu);
router.post('/menu', menuController.createMenu);

/**
 * Rutas REST para restaurante.
 */
router.get('/restaurant', restaurantController.getRestaurants);
router.post('/restaurant', restaurantController.createRestaurant);

/**
 * Rutas REST para user.
 */
router.get('/user', userController.getUser);

module.exports = router;