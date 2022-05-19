const jwt = require("jsonwebtoken")

const createUserToken = async(user, req, res) => {

    //criando token
    const token = jwt.sign({
        name: user.name,
        id:user._id
    }, "nossosecret")

    //return do token para pegar na front
    res.status(200).json({
        message: "voce esta autenticado",
        token: token,
        userID: user._id,
    })
}

module.exports = createUserToken