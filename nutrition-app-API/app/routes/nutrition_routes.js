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
router.post('/intake/:profileId', (req, res, next) => {
    console.log('req params profileId', req.params.profileId)
    console.log('req.body', req.body)
    // console.log('this is req', req)
    Profile.findById(req.params.profileId)
        .then(profile => {
            console.log('this is profile', req.body)
            profile.nutrition.push(req.body)
            return profile.save()
        })
        .then(nutrition => res.status(201).json({ nutrition: nutrition.toObject()}))
        .catch(next)
})
router.patch('/intake/:profileId/:intakeId', requireToken, removeBlanks, (req, res, next) => {
    Profile.findByIdAndUpdate(req.params.profileId)
        .then(handle404)
        .then((profile) => {
            const intake = profile.nutrition.id(req.params.intakeId)
            console.log('this is intake: ' ,intake)
            console.log('this is profile: ', profile)   
            intake.set(req.body)
            // console.log(nutrition) // WTF THIS WORKED
            return profile.save()
        })
        // if that succeeded, return 204 and no JSON
        .then(() => res.sendStatus(204))
        // if an error occurs, pass it to the handler
        .catch(next)
})
    module.exports = router