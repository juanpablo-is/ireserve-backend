const express = require('express');
const router = express.Router();

// Controladores
const menuController = require('../controllers/menu');
const restaurantController = require('../controllers/restaurant');
const userController = require('../controllers/user');
const reservationController = require('../controllers/reservation');
const utilsController = require('../controllers/utils');

/**
 * Rutas REST para menu.
 */
router.get('/menu', menuController.getMenu);
router.post('/menu', menuController.createMenu);

/**
 * Rutas REST para restaurante.
 */
router.get('/restaurants', restaurantController.getRestaurants);
router.get('/restaurant/:id', restaurantController.getRestaurant);
router.post('/restaurant', restaurantController.createRestaurant);
router.put('/restaurant/:id', restaurantController.updateRestaurant);
router.post('/restaurant-rate/:id', restaurantController.rateRestaurant);

/**
 * Rutas REST para menu.
 */
router.post('/reservation', reservationController.createReservation);
router.put('/reservation/:id', reservationController.updateReservation);
router.get('/reservations/:id', reservationController.getReservations);

/**
 * Rutas REST para user.
 */
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser)

/**
 * Rutas REST para funciones de utilidad.
 */
router.get('/ads', utilsController.getAds);
router.post('/ads', utilsController.createAds);

module.exports = router;