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
    createRestaurant
};