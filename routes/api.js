const express = require('express');
const router = express.Router();

// Controladores
const menuController = require('../controllers/menu');
const restaurantController = require('../controllers/restaurant');
const userController = require('../controllers/user');
const reservationController = require('../controllers/reservation');
const utilsController = require('../controllers/utils');
const credentialController = require('../controllers/credential');

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
router.put('/restaurant', restaurantController.updateRestaurant);



/**
 * Rutas REST para perfil cliente.
 */
 router.get('/perfil-cliente', restaurantController.getRestaurants);
 

/**
 * Rutas REST para menu.
 */
router.post('/reservation', reservationController.createReservation);
router.delete('/reservation/:id', reservationController.deleteReservation);
router.get('/reservations/:id', reservationController.getReservations);

/**
 * Rutas REST para user.
 */
router.get('/user', userController.getUser);
router.put('/user', userController.updateUser)

/**
 * Rutas REST para funciones de utilidad.
 */
router.get('/ads', utilsController.getAds);
router.post('/ads', utilsController.createAds);

/**
 * Rutas REST para actualización credenciales.
 */
router.put('/sui', credentialController.updateCredentials)

module.exports = router;