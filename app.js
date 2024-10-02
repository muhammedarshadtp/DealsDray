const express = require('express')
const path = require('path')
const session = require('express-session')
const app = express()
const port = 3001

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true
  }));

const adminRouter = require('./router/adminRouter')

app.use('/',adminRouter)


















app.listen(port,()=>console.log(`server started ${port}`))



