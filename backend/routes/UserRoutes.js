const router = require('express').Router()

const UserController = require('../controllers/UserController')

//vall
const verifyToken = require('../helpers/verify-token')

const { imageUpload } = require("../helpers/image-upload")


router.post('/register', UserController.register)          //CADASTRAR USER
router.post('/login', UserController.login)                //LOGIN
router.get('/checkuser', UserController.checkUser)         //VERIFICAR USER PELA TOKEN
router.get('/:id', UserController.getUserById)             //VERIFICAR USER POR ID
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)       // edit user, patch pq é rota protegida

module.exports = router
