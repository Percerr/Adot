const Pet = require("../models/Pet")

module.exports = class PetController {

    // criar animal
    static async create(req, res) {
        res.json({ message: "deu certo"})
    }
}