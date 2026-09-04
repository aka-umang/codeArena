const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        
        minLength: 3,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable:true
    },
    age:{
        type: Number,
        
        min: 6,
        max: 80
    },
     role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
     },
     problemsSolved: {
        type: [{
          type:Schema.Types.ObjectId,
          ref:'problem',
          unique:true
        }],
        
        
     },
     password: {
        type: String,
        required: true,
        minLength: 8
     },
     isPremium: {
    type: Boolean,
    default: false
},
     // Rating starts at 0 for every new user and only goes up when they
     // actually solve problems. Solving regularly (keeping a streak alive)
     // earns bigger jumps, so the rank on the dashboard reflects real,
     // consistent effort instead of just "who joined first".
     rating: {
        type: Number,
        default: 0
     }
},{timestamps: true});

const user = mongoose.model('user', userSchema);
module.exports = user;