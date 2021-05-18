const db = require("../utils/database");

/**
 * Endpoint que retorma información de un usuario individual.
 */
const getUser = (req, res) => {
    const { id: uid } = req.params;
    if (!uid) {
        return res.status(401).json({ message: 'ID del restaurante debe ser obligatorio.' });
    }

    db.collection('users').doc(uid).get()
        .then(data => {
            const user = data.data();
            if (!user) {
                return res.status(400).json({ response: "Petición no valida." });
            }

            delete user.password;

            if (user.role === "Cliente") {
                db.collection('restaurants')
                    .where('idUser', '==', uid)
                    .get()
                    .then(response => {
                        if (response.docs.length > 0) {
                            const restaurant = response.docs[0].data();
                            user.type = restaurant.type;
                            user.urlPhoto = restaurant.urlPhoto;
                            user.idRestaurant = response.docs[0].id;
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

/**
 * Este método actualiza un registro en Firebase de un usuario.
 */
const updateUser = (req, res) => {
    const { id: uid } = req.params;
    if (!uid) {
        return res.status(401).json({ message: 'ID del restaurante debe ser obligatorio.' });
    }

    const newUser = req.body;
    if (!newUser) {
        return res.status(400).json({ response: "Petición no valida." });
    }

    db.collection('users').doc(uid).get()
        .then(data => {
            const user = data.data();
            if (user) {
                if (user.password !== newUser.password) {
                    return res.status(400).json({ response: "Credenciales invalidas." });
                }

                newUser.password = newUser.newPass;
                delete newUser.newPass;

                db.collection('users')
                    .doc(uid)
                    .update(newUser)
                    .then(() => {
                        res.status(200).send({ response: "Usuario actualizado." })
                    });
            } else {
                return res.status(400).json({ response: "Petición no valida." });
            }
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

module.exports = {
    getUser,
    updateUser
}