const db = require("../utils/database");

const getAds = (req, res) => {
    const limit = parseInt(req.query.limit) || 3;
    db.collection("ads")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get()
        .then(data => {
            const docs = data.docs.map(doc => doc.data());
            res.json(docs);
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

const createAds = (req, res) => {
    const ads = req.body;
    if (!ads.name || !ads.desc || !ads.url) {
        return res.status(400).json({ response: "Petición no valida." });
    }

    ads.createdAt = Date.now();

    db.collection("ads")
        .add(ads)
        .then(data => {
            if (data.id) {
                return res.json({ message: "Anuncio guardado exitosamente" });
            }
            return res.status(400).json({ message: "No se ha podido guardar, intente nuevamente." });
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });
}

module.exports = {
    getAds,
    createAds
}