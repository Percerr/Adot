const router = require('express').Router()

const UserController = require('../controllers/UserController')

router.post('/register', UserController.register)          //CADASTRAR USER
router.post('/login', UserController.login)                //LOGIN
router.get('/checkuser', UserController.checkUser)         //VERIFICAR USER PELA TOKEN
router.get('/:id', UserController.getUserById)             //VERIFICAR USER POR ID
module.exports = router
