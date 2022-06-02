const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { genSalt } = require('bcrypt')

module.exports = class UserController{
    static async register(req, res){
        //TESTE RENDER ROTA POST NO POSTMAN
        //res.json('hello adopt') 

        const { name, email, phone, password, confirmpassword } = req.body

        // validações
        if (!name) {
            res.status(422).json({ message: 'O name é obrigatório'})
            return
        }

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório'})
            return
        }

        if (!phone) {
            res.status(422).json({ message: 'O phone é obrigatório'})
            return
        }

        if (!password) {
            res.status(422).json({ message: 'O password é obrigatório'})
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'O confirmpassword é obrigatório'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({ message: 'A Senha e a confirmação de senha precisam ser iguais!'})
            return
        }
        

        //check if user exists
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({
                message: "por favor, utilize outro e-mail",
            })
            return
        }


        // create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //create a user // nome var = nome chave, por isso só precisa passar o hash
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        }catch(error) {
            res.status(500).json({message: error })
        }
    }

static async login(req, res) {

    const {email, password} = req.body
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório'})
            return
        }

        if (!password) {
            res.status(422).json({ message: 'O password é obrigatório'})
            return
        }

        //check if user exist
        const user = await User.findOne({ email: email })
        //console.log(user)
        if (!user) {
                res.status(422).json({
                message: "Não existe usuario cadastrado com este email",
            })
            return
        }

        //check if password match with db pwd
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({
            message: 'Senha invalida',
        })
        return
        }
        await createUserToken(user, req, res)
    }


    static async checkUser(req,res){

        let currentUser 
        //console.log(req.headers.authorization) auth confirm
        
        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, 'segredoifsp')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res){

        const id = req.params.id

        const user = await User.findById(id).select('-password') // .select para não exibir o password

        //const user = await User.findById(id) // sem id


        if (!user) {
            res.status(422).json({
                message: 'user não encontrado',
            })
            return
        }
        res.status(200).json({ user})

    }

    static async editUser (req, res) {
        const id = req.params.id

        //checar se user exist
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        let image = ''

        if (req.file) {
            user.image = req.file.filename
        }

        // validações
        if (!name) {
            res.status(422).json({ message: 'O name é obrigatório'})
            return
        }

        user.name = name

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório'})
            return
        }

        //checar se e-mail ja esta utilizado
        const userExists = await User.findOne({ email: email })

        //user.email = email
        if (user.email !== email && userExists) {
            res.status(422).json({
                message: 'utilize outro e-mail!',
            })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'O phone é obrigatório'})
            return
        }

        user.phone = phone

        if (password != confirmpassword) {
            res.status(422).json({ message: 'senhas não conferem'})
            return
        } else if (password === confirmpassword && password != null) {

            //create pwd

            const salt = await bcrypt.genSalt(12)
            const passwordHash =  await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        try {

            // retornar os dados alterados do usuario
             await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},
                {new: true},
            )

            res.status(200).json({
                message: "user atualizado sucess"
            })
        } catch (err) {
            res.status(550).json({ message: err })
        }
        //console.log(user)




        //checar se user exist
        //const user = await User.findById(id)





    }
 }

