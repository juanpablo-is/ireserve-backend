const db = require("../utils/database");

const getMenu = async (req, res) => {
    const snapshot = await db.collection('menu').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
    res.json(snapshot);
};

const createMenu = async (req, res) => {
    const menu = await db.collection('menu').add({
        'first': 'Alan',
        'middle': 'Mathison',
        'last': 'Turing',
        'born': 1912
    });
    res.json(menu);
};

module.exports = {
    getMenu,
    createMenu
};