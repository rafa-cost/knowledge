const bodyParser = require('body-parser')     //fazendo os imports das dependecias do package.json
const cors = require('cors')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}