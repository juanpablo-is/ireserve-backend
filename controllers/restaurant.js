const db = require("../utils/database");

const getRestaurants = async (req, res) => {
    const snapshot = await db.collection('restaurant').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
    res.json(snapshot);
};

/**
 * Este método crea un registro en Firebase de un restaurante.
 */
const createRestaurant = (req, res) => {
    const restaurant = req.body;
    if (restaurant.idUser) {
        db.collection('users')
            .where('email', '==', restaurant.idUser)
            .get()
            .then(user => {
                if (user.docs.length) {
                    db.collection('restaurant')
                        .add(restaurant)
                        .then((data) => {
                            res.status(201).json(data);
                        }).catch(e => {
                            res.status(501).json({ message: e.message });
                        });
                } else {
                    res.status(401).json({ message: `No hay usuario con el ID '${restaurant.idUser}'` });
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
    createRestaurant
};