const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required: true
    },
    tags: [String],
    category: {
        type: String,
        required: true,
        enum: ["technology", "entertainment", "life style", "food", "fashion"]
    },
    subcategory: [Array],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    timestamps: true
})

module.exports = mongoose.model("Blog", blogSchema)