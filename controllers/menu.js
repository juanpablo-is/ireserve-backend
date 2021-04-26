const db = require("../utils/database");

const getMenu = async (req, res) => {
    const idUser = req.query.idUser;
    const idRestaurant = req.query.idUser;

    if (!idRestaurant || !idUser) {
        return res.status(400).json({ response: "Petición no valida." });
    }

    try {
        const snapshot = await db.collection('menu')
            .where('idUser', '==', idUser)
            .where('idRestaurant', '==', idRestaurant)
            .get();

        if (snapshot.docs.length > 0) {
            res.status(201).json(snapshot.docs[0].data());
        } else {
            res.status(400).json({ response: 'empty' });
        }
    } catch (error) {
        res.status(500).json({ response: error.message });
    }
};

const createMenu = async (req, res) => {
    const menu = req.body;
    if (menu) {
        try {
            if (!menu.idRestaurant || !menu.idUser) {
                return res.status(400).json({ response: "Petición no valida, revise cuerpo de la petición." });
            }

            const restaurant = await db.collection('restaurant')
                .where('idUser', '==', menu.idUser)
                .where('idRestaurant', '==', menu.idRestaurant)
                .get();

            if (!restaurant.docs.length) {
                return res.status(400).json({ response: `No se ha encontrado un restaurante con el ID '${menu.idRestaurant}'.` });
            }

            const auxMenu = await db.collection('menu')
                .where('idRestaurant', '==', menu.idRestaurant)
                .get();

            if (auxMenu.docs.length > 0) {
                res.status(500).json({ response: `Ya hay un menú creado para el usuario '${menu.idRestaurant}'.` });
            } else {
                await db.collection('menu')
                    .add(menu);

                res.status(201).json({ response: "Menu agregado." });
            }
        } catch (error) {
            res.status(500).json({ response: error.message });
        }
    } else {
        res.status(400).json({ response: "Cuerpo de la petición está vacia." });
    }
};

module.exports = {
    getMenu,
    createMenu
};