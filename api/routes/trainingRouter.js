'use strict'
module.exports = function(app) {
    const t = require('../controllers/trainingController');
    app.get('/trainingContent', t.getTrainingContent)
}