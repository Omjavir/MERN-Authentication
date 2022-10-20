const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./config/database')
const userRoutes = require('./routes/userRoute')
// const { isUserAuthenticated } = require('./middleware/auth')

// MIDDLEWARE
app.use(express.json())
app.use(cors())

// CONNECTION TO DATABASE
db()

app.get('/', (req, res) => {
    res.send('Hello World')
})

// ROUTES
app.use('/auth', userRoutes)
// app.use('/',isUserAuthenticated, quoteRoutes)

app.listen(5000, () => {
    console.log('App listening on http://localhost:5000');
})