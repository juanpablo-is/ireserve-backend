const fs = require('firebase-admin');
fs.initializeApp({ credential: fs.credential.cert(require("./credentialsFirebase.json")) });
module.exports = fs.firestore();