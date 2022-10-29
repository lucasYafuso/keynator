const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const { urlencoded } = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const controllers = require('./controllers/controllers')
const User = require('./models/userSchema')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/keynator')
        .then(console.log('connected to database'))
}

app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));



//---------------------------- setting up to save the session in mongo instead of the memory
const store = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/keynator',
    secret: 'secret',
    touchAfter: 24 * 60 * 60
})

store.on('error', (err) => {
    console.log('session connection error', err)
})
//----------------------------


// session about
sessionConfig = {
    store,
    name: 'session', //--> to change the name instead of the default connect.sid
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Date.now is this day and its in miliseconds the next numbers refers to one week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true, // security reasons so third party members wont have acces to the information
        // secure: true //--> this code allows the usage of session only in https (http secure) we are commenting this for now
    }
}
app.use(session(sessionConfig))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash())
app.use((req, res, next) => {
    // res.locals passes in a variable in all templates. the name of the variables are setted after res.locals
    res.locals.currentUser = req.user //--------------> req.user is a method of passport and contains data from the user in the session. THIS HAS TO BE BELOW PASSPORT'S MIDDLEWARE
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.get('/home', controllers.home)

app.get('/register', controllers.registerForm)
app.post('/register', controllers.register)

app.get('/login', controllers.loginForm)
app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), controllers.login)

app.get('/logout', controllers.logout)

app.get('/play', controllers.play)

app.get('/scores/:points/:lang', controllers.scores)

app.get('/account', controllers.account)



app.listen(3000, () => {
    console.log('listening on port 3000')
})