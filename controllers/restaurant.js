const db = require("../utils/database");

const getRestaurants = (req, res) => {
    db.collection('restaurant')
        .get()
        .then(data => {
            const docs = data.docs.map(doc => {
                const restaurant = doc.data();
                restaurant.id = doc.id;

                const { stars, countStars } = calculateStars(restaurant.stars);
                restaurant.stars = stars;
                restaurant.countStars = countStars;
                restaurant.diff = (Math.random() * (120 - 2) + 2).toFixed(2) + 'm';
                return restaurant;
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

    db.collection('restaurant')
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
                    db.collection('restaurant')
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
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    const timeStart = start.split(':');
    const timeEnd = end.split(':');

    if ((hour >= timeStart[0] && minute >= timeStart[1]) && (hour <= timeEnd[0] && minute < timeEnd[1])) {
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