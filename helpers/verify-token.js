const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//mid validar token
const checkToken = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json ({ message: 'Acesso Negado'})
    }
    
    const token = getToken(req)

    if (!token) {
        return res.status(401).json ({ message: 'Acesso Negado'})
    }

    try {

        const verified = jwt.verify(token, 'segredoifsp')
        req.user = verified
        next()

    } catch (err) {
        return res.status(400).json ({ message: 'token invalido'})
    }

}

module.exports = checkToken