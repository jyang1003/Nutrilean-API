const mongoose = require('mongoose')
const User = require('./user')

const nutritionSchema = new mongoose.Schema({
    calories: {
        type: Number
    },
    protein: {
        type: Number
    },
    carbs: {
        type: Number
    },
    fats: {
        type: Number
    },
    date: {
        type: Date,
        required: false
    }
})

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    height: {
        type: Number,
        required: false
    },
    weight: {
        type: Number,
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    baseCaloricMaintenence: {
        type: Number,
        required: false
    },
    caloricGoal: {
        type: Number,
        required: false
    },
    proteinGoal: {
        type: Number,
        required: false
    },
    carbsGoal: {
        type: Number,
        required: false
    },
    fatsGoal: {
        type: Number,
        required: false
    },
    nutrition: [nutritionSchema],
    owner: {
        // this links the user Id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Profile', profileSchema)

