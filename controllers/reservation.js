const db = require('../utils/database');

/**
 * Lista las reservaciones de acuerdo al usuario.
 */
const getReservations = (req, res) => {
    const { id: idUser } = req.params;
    if (!idUser) {
        return res.status(400).json({ response: "Petición no valida, revise cuerpo de la petición." });
    }

    db.collection("reservation")
        .where("idUser", "==", idUser)
        .orderBy("timestamp", "asc")
        .get()
        .then(response => {
            const dataResponse = {
                pended: [],
                actived: [],
                completed: [],
                canceled: [],
                declined: [],
            };

            Promise.all(response.docs.map(doc => {
                const data = doc.data();
                data.id = doc.id;
                const { idRestaurant } = data;

                return db.collection("restaurants")
                    .doc(idRestaurant)
                    .get()
                    .then(responseRestaurant => {
                        const restaurant = responseRestaurant.data();
                        if (restaurant) {
                            data.restaurant = restaurant.name;
                            data.address = restaurant.address;
                            data.createdAt = new Date(data.createdAt).toLocaleString();
                            data.date = new Date(data.timestamp).toLocaleString();

                            dataResponse[data.type].push(data);
                        }
                    });
            }))
                .then(() => {
                    res.json(dataResponse);
                });
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

/**
 * Función REST que crea una reservación en la DB.
 */
const createReservation = (req, res) => {
    const reservation = req.body;

    if (!reservation.idUser || !reservation.idRestaurant) {
        return res.status(400).json({ response: "Petición no valida, revise cuerpo de la petición." });
    }

    db.collection("reservation")
        .add({ ...reservation, createdAt: Date.now() })
        .then(response => {
            const data = response.id;
            if (data) {
                return res.status(201).json(data);
            }
            res.status(500).json({ response: "Error al crear la reserva, intente nuevamente." });
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

/**
 * Elimina una reservación de la db.
 */
const updateReservation = (req, res) => {
    const { id: idUser } = req.params;
    const body = req.body;
    if (!idUser) {
        return res.status(400).json({ response: "Petición no valida, revise cuerpo de la petición." });
    }

    db.collection("reservation")
        .doc(idUser)
        .update({ type: body.type })
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

module.exports = {
    getReservations,
    createReservation,
    updateReservation
}