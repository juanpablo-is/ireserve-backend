const db = require("../utils/database");

const getMenu = async (req, res) => {
    const id = req.query.idUser;
    const snapshot = await db.collection('menu')
    .where('idUser','==',id)
    .get();
    if (snapshot.docs.length>0) {
        res.status(201).json(snapshot.docs[0].data());
    } else {
        res.status(201).json({response:'empty'});
    }
};

const createMenu = async (req, res) => {
    const menu = req.body;
    console.log(menu);
    if(menu){
        const snap = await db.collection('users')
        .where('email', '==', menu.idUser)
        .get()

        const email = snap.docs[0].data().email;

        const auxmenu = await db.collection('menu')
        .where('idUser', '==', email)
        .get()

        if (auxmenu.docs.length > 0) {
            db.collection('menu')
            .doc(auxmenu.docs[0].id)
            .update(menu);
            res.json({res:"Menu Actualizado"})
        }else{
            db.collection('menu')
            .add(menu)
            res.json({res:"Menu Agregado"})
        }
    }else{
        res.status(201).json({res:"vacio"})
    }
};

module.exports = {
    getMenu,
    createMenu
};