const db = require("../utils/database");

const updateCredentials = (req, res)=>{
    const newuser = req.body;

    db.collection('users').doc(newuser.uid).get()
        .then(data => {
            const user = data.data();
            if (!user) {
                return res.status(400).json({ response: "Petición no valida." });
            }
            else{
                if (user.password == newuser.password) {
                    console.log(newuser)
                }
                else{
                    return res.status(400).json({ response: "Credenciales invalidad" });
                }
            }
        })
        .catch(error => {
            res.status(500).json({ response: error.message });
        });

    res.status(201).send({response: "listo"});
}

module.exports = {
    updateCredentials
}