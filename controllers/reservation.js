const db = require('../utils/database');

const getReservation = (req, res) => {

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
                return res.json(data);
            }
            res.status(500).json({ response: "Error al crear la reserva, intente nuevamente." });
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

module.exports = {
    getReservation,
    createReservation
}