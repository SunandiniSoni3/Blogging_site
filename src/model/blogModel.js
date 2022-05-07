const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({
    title: {
        required: "title is required",
        type: String,
        trim:true
    },
    body: {
        required: "body is required",
        type: String,
        trim:true
    },
    authorId: {
        required: "Blog author is required",
        type: ObjectId,
        ref: 'Author'
    },
    tags: {
        type: [String],
    },
    category: {
        type: String,
        require: "category is required"
       
    },
    subcategory: {
        type: [String]
    },

    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false

    },
    publishedAt: {
        type: Date,
        default: null
    },

    isPublished: {
        type: Boolean,
        default: false

    }


}, { timestamps: true });

module.exports = mongoose.model('BlogsCollection', blogSchema)