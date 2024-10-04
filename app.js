const express = require('express')
const path = require('path')
const mongoose=require('mongoose')
const session = require('express-session')
const nocache = require('nocache')
const flash = require('express-flash')
const bodyParser = require('body-parser')

const app = express()
const port = 3001


app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(nocache());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, 
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

const adminRouter = require('./router/adminRouter')

app.use('/',adminRouter)


















app.listen(port,()=>console.log(`server started ${port}`))



