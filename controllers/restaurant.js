const db = require("../utils/database");
const firebaseAdmin = require('firebase-admin');
const geofirestore = require('geofirestore');

const getRestaurants = (req, res) => {
    const GeoFirestore = geofirestore.initializeApp(db);
    const geocollection = GeoFirestore.collection('restaurants');
    const query = geocollection.near({ center: new firebaseAdmin.firestore.GeoPoint(4.629605998403462, -74.06571953853415), radius: 1 });

    query.get()
        .then((data) => {
            const docs = [];
            data.docs.forEach(doc => {
                const restaurant = doc.data();
                restaurant.id = doc.id;
                restaurant.open = calculateOpenRestaurant(restaurant.dateStart, restaurant.dateEnd);

                const { stars, countStars } = calculateStars(restaurant.stars);
                restaurant.stars = stars;
                restaurant.countStars = countStars;
                restaurant.distance = (doc.distance * 1000).toFixed(2);

                restaurant.open ? docs.unshift(restaurant) : docs.push(restaurant);
            });
            res.json(docs);
        })
        .catch(error => {
            res.status(501).json({ message: error.message });
        });
};

/**
 * Retorma la información de un restaurante en especifico.
 */
const getRestaurant = (req, res) => {
    const { id: idRestaurant } = req.params;
    if (!idRestaurant) {
        return res.status(401).json({ message: 'ID del restaurante debe ser obligatorio.' });
    }

    db.collection('restaurants')
        .doc(idRestaurant)
        .get()
        .then(response => {
            const data = response.data();
            if (data) {
                data.open = calculateOpenRestaurant(data.dateStart, data.dateEnd);

                const { stars, countStars } = calculateStars(data.stars);
                data.stars = stars;
                data.countStars = countStars;

                return res.json(data);
            }
            return res.json({});
        })
        .catch(error => {
            res.status(501).json({ message: error.message });
        });
};

/**
 * Este método crea un registro en Firebase de un restaurante.
 */
const createRestaurant = (req, res) => {
    const restaurant = req.body;
    if (restaurant.idUser) {
        db.collection('users')
            .doc(restaurant.idUser)
            .get()
            .then(response => {
                const user = response.data();
                if (user) {
                    restaurant.coordinates = new firebaseAdmin.firestore.GeoPoint(restaurant.coordinates.lat, restaurant.coordinates.lng);
                    restaurant.stars = {
                        star_1: 0,
                        star_2: 0,
                        star_3: 0,
                        star_4: 0,
                        star_5: 0,
                    };

                    const GeoFirestore = geofirestore.initializeApp(db);
                    GeoFirestore.collection('restaurants')
                        .add(restaurant)
                        .then((data) => {
                            res.status(201).json({ idRestaurant: data.id });
                        }).catch(e => {
                            res.status(501).json({ message: e.message });
                        });
                } else {
                    res.status(401).json({ message: `No se ha encontrado registro para este restaurante.` });
                }
            }).catch(e => {
                res.status(501).json({ message: e.message });
            });
    } else {
        res.status(401).json({ message: 'ID del usuario debe ser obligatorio.' });
    }
};

module.exports = {
    getRestaurants,
    getRestaurant,
    createRestaurant
};

/**
 * Calcula si el restaurante está abierto o cerrado de acuerdo a la fecha.
 */
const calculateOpenRestaurant = (start, end) => {
    const dateNow = new Date();

    const timeStart = start.split(':');
    const timeEnd = end.split(':');

    const dateStart = new Date();
    const dateEnd = new Date();
    dateStart.setHours(timeStart[0]);
    dateStart.setMinutes(timeStart[1]);
    dateEnd.setHours(timeEnd[0]);
    dateEnd.setMinutes(timeEnd[1]);

    if ((dateNow.getTime() >= dateStart.getTime()) && (dateNow.getTime() <= dateEnd.getTime())) {
        return true;
    }
    return false;
}

/**
 * Calcula el total y promedio de las estrellas (puntuación).
 */
const calculateStars = (stars) => {
    if (!stars || Object.keys(stars).length !== 5) {
        return { stars: undefined, countStars: undefined }
    }
    const count = stars.star_1 + stars.star_2 + stars.star_3 + stars.star_4 + stars.star_5;
    const avgStars = (5 * stars.star_5 + 4 * stars.star_4 + 3 * stars.star_3 + 2 * stars.star_2 + 1 * stars.star_1) / (count);

    return { stars: avgStars.toFixed(2), countStars: count }
}