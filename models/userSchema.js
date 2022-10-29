const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const scoresSchema = new Schema({language: String, score:Number})
const userSchema = new Schema({
    lastScores: [scoresSchema],
    highscore: {spanish:Number, english:Number}
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)