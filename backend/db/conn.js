const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb+srv://admin:admin@cluster0.mgvwg.mongodb.net/?retryWrites=true&w=majority')

    //await mongoose.connect('mongodb://0.0.0.0:27017/adot')    console.log("Conectou ao Banco !!")
    console.log("Conectou ao Banco !!")

}

main().catch((err) => console.log(err))

module.exports = mongoose