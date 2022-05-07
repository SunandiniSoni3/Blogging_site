const mongoose = require('mongoose');


const authorSchema = new mongoose.Schema({
    fname: {
        type:String,
        required:"first name is required",
        trim:true
    },
    lname: {type:String,
        required:"last name is required",
        trim:true
    },
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: "title is required"
    },
    email: {
        require: "email is required",
        type: String,
        unique: true,
        trim:true,
        lowercase:true
    },
    password: {
        require: "password is required",
        type: String,
        trim:true
    }
}, { timestamps: true });


module.exports = mongoose.model('AuthorCollection', authorSchema)