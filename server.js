const express = require('express');
const connectDB = require('./config/db')
const app = express()
const path = require('path')

//connect DB
connectDB()

// Init Middleware
app.use(express.json({extended: false}))


//defining Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/post', require('./routes/api/post'))
app.use('/api/profile', require('./routes/api/profile'))

//server static assets  in production
if(process.env.NODE_ENV === "production"){
    //set static folder 
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile();
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started as ${PORT}`));