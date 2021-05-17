const db = require("../utils/database");

const getUserPerId = (req, res) => {
    const {id: uid} = req.params;
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

const getUser = (req, res) => {
    let uid = req.query.uid;
    db.collection('users').doc(uid).get()
        .then(data => {
            const user = data.data();
            console.log(uid)
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
                            user.idRestaurant = response.docs[0].id
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

const updateUser =  (req, res) => {
    const newuser = req.body;
    console.log(newuser)
    
    db.collection('users').doc(newuser.uid).get()
        .then(data => {
            const user = data.data();
            if (!user) {
                return res.status(400).json({ response: "Petición no valida." });
            }
            else{
                if (user.password == newuser.password) {
                    newuser.password = newuser.newPass
                    delete newuser.newPass
                    db.collection('users')
                    .doc(newuser.uid)
                    .set(newuser);
                    res.status(200).send({response:"usuario actualizado"})
                }
                else{
                    return res.status(400).json({ response: "Credenciales invalidad" });
                }
            }
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

module.exports = {
    getUser, updateUser
}