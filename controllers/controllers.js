const User = require('../models/userSchema')
const { spanishWords } = require('../seeds/spanishWords')
const { englishWords } = require('../seeds/englishWords')
const {shuffle} = require('../utils')

module.exports.home = (req, res) => {
    res.render('home.ejs')
}

module.exports.registerForm = async (req, res) => {
    res.render('register.ejs')
}

module.exports.register = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = new User({ username, highscore:{english:0, spanish:0} })
        const registerUser = await User.register(user, password)
        req.login(registerUser, (err) => {
            if (err) { return next(err) }
            req.flash('success', 'successfully registered')
            res.redirect('/home')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.loginForm = (req, res) => {
    res.render('login.ejs')
}
module.exports.login = (req, res) => {
    req.flash('success', `Welcome ${req.user.username}`)
    res.redirect('/home')
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/home');
    });
}
module.exports.play = (req, res) => {
    if (req.query.language === 'spanish') {
        const mixedWords = shuffle(spanishWords)
        const lang = 'Spanish'
        return res.render('play.ejs', { mixedWords, lang })
    } else {
        const mixedWords = shuffle(englishWords)
        const lang = 'English'
        return res.render('play.ejs', { mixedWords, lang})
    }
}
module.exports.scores = async (req, res) => {
    if (req.user) {
        const { points, lang } = req.params;
        const user = await User.findById(req.user._id)
        // check if this works
        if(lang === 'Spanish' && points > user.highscore.spanish){
            user.highscore.spanish = points
        }else if (lang === 'English' && points > user.highscore.english){
            user.highscore.english = points
        }

        if(user.lastScores.length < 10){
            user.lastScores.push({language:lang, score:points})
        }else {
            user.lastScores.shift()
            user.lastScores.push({language:lang, score:points})
        }
        await user.save()
    }

}

module.exports.account = (req, res)=>{
    res.render('account.ejs')
}