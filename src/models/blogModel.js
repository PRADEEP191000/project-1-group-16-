const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Blog title is required',
        trim: true
    },

    body: {
        type: String,
        required: 'Blog body is required',
        trim: true
    },

    authorId: {
        type: ObjectId,
        ref: "Author",
        required: 'Author Id is required'
    },
    tags: [{ type: String, trim: true }],

    category: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],

    subcategory: [{ type: String, trim: true }],

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

}, { timeStamps: true });

module.exports = mongoose.model("Blog", blogSchema);