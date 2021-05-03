const db = require("../utils/database");

const getUser = (req, res) => {
    const uid = req.query.uid;

    db.collection('users').doc(uid).get()
        .then(data => {
            const user = data.data();

            if (!user) {
                return res.status(400).json({ response: "Petición no valida." });
            }

            delete user.password;

            if (user.role === "Cliente") {
                db.collection('restaurant')
                    .where('idUser', '==', uid)
                    .get()
                    .then(response => {
                        const restaurant = response.docs[0].data();
                        if (restaurant) {
                            user.type = restaurant.type;
                            user.urlPhoto = restaurant.urlPhoto;
                            return res.json({ data: user });
                        }
                        return res.status(400).json({ status: false, mensaje: 'Establecimiento no encontrado.' });
                    });
            } else {
                return res.json({ data: user });
            }
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

module.exports = {
    getUser
}