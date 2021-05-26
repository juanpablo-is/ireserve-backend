const db = require("../utils/database");

const getMenu = (req, res) => {
    const idRestaurant = req.query.idRestaurant;

    if (!idRestaurant) {
        return res.status(400).json({ response: "Petición no valida." });
    }

    db.collection('menu')
        .where('idRestaurant', '==', idRestaurant)
        .get()
        .then(response => {
            if (response.docs.length == 1) {
                const docs = response.docs[0].data();
                return res.json(docs);
            }
            return res.json({});
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
};

const createMenu = async (req, res) => {
    const menu = req.body;
    if (menu) {
        try {
            if (!menu.idRestaurant) {
                return res.status(400).json({ response: "Petición no valida, revise cuerpo de la petición." });
            }
            const restaurant = await db.collection('restaurants').doc(menu.idRestaurant).get();

            if (!restaurant._fieldsProto) {
                return res.status(400).json({ response: 'No se ha encontrado un restaurante registrado.' });
            }

            const auxMenu = await db.collection('menu')
                .where('idRestaurant', '==', menu.idRestaurant)
                .get();
            if (auxMenu.docs.length > 0) {
                await db.collection('menu')
                    .doc(auxMenu.docs[0].id)
                    .update(menu);

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