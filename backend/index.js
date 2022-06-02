const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5001;
//config JSON response
app.use(express.json())

//solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

// public folder for images
app.use(express.static('public'))

// routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(port)

//res.send("teste")

//token githhubbb
//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
//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