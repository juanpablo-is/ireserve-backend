const db = require("../utils/database");

const getMenu = async (req, res) => {
    const idRestaurant = req.query.idRestaurant;

    if (!idRestaurant) {
        return res.status(400).json({ response: "Petición no valida." });
    }

    try {
        const snapshot = await db.collection('menu')
            .where('idRestaurant', '==', idRestaurant)
            .get();

        if (snapshot.docs.length > 0) {
            res.status(201).json(snapshot.docs[0].data());
        } else {
            res.status(200).json({ response: 'empty' });
        }
    } catch (error) {
        res.status(500).json({ response: error.message });
    }
};

const createMenu = async (req, res) => {
    const menu = req.body;
    console.log(menu)
    if (menu) {
        try {
            if (!menu.idRestaurant) {
                return res.status(400).json({ response: "Petición no valida, revise cuerpo de la petición." });
            }
            const restaurant = await db.collection('restaurant').doc(menu.idRestaurant)
                console.log(restaurant);

            if (!restaurant) {
                return res.status(400).json({ response: 'No se ha encontrado un restaurante registrado.' });
            }

            const auxMenu = await db.collection('menu')
                .where('idRestaurant', '==', menu.idRestaurant)
                .get();
            if (auxMenu.docs.length > 0) {
                await db.collection('menu')
                .doc(auxMenu.docs[0].id)
                .set(menu);
                res.status(201).json({ response: `Menu actualizado.` });
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