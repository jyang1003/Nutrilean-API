// this boilerplate is pulled from example_routes.js
const express = require('express')
const passport = require('passport')

// pull profile database model
const Profile = require('../models/profile')

// customer error messages
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

// sends 401 error
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate router
const router = express.Router()

// route to show calories, carbs, fats, protein
router.get('/intake/:profileId', (req, res, next) => {
    Profile.findById(req.params.profileId)
    .then(profile => {
        console.log('this is intake', profile)
        console.log('this is profile nutrition', profile.nutrition)
        res.status(200).json(profile)
        return profile.nutrition
    })
    .catch(next)
})
//route to post
router.post('/intake', (req, res, next) => {
    Nutrition.create(req.body)
        .then(createdIntake => {
            console.log('this is created intake', createdIntake)
            res.status(201).json(createdIntake.toObject())
        })
        .catch(next)
})
//route to patch calories, carbs, fats, or protein



router.patch('/intake/:profileId/:intakeId', removeBlanks, (req, res, next) => {
    Profile.findById(req.params.profileId)
        .then(handle404)
        .then(profile => {
            console.log('profile', req.body.nutrition)
            profile.updateOne(req.body.nutrition)
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})
    module.exports = router