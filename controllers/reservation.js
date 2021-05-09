const db = require('../utils/database');

const getReservations = (req, res) => {
    const { id: idUser } = req.params;
    if (!idUser) {
        return res.status(400).json({ response: "Petición no valida, revise cuerpo de la petición." });
    }

    db.collection("reservation")
        .where("idUser", "==", idUser)
        .get()
        .then(response => {
            const pending = [];
            const active = [];
            const complete = [];

            response.docs.forEach(doc => {
                const data = doc.data();

                if (!data.state) {
                    pending.push(data);
                } else {
                    const timestamp = Date.now();
                    if (timestamp > data.timestamp) {
                        complete.push(data);
                    } else {
                        active.push(data);
                    }
                }
            });
            res.json({ pending, active, complete });
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
        .add(reservation)
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

module.exports = {
    getReservations,
    createReservation
}