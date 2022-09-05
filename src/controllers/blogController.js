const BlogModel = require("../models/blogModel")
const AuthorModel = require('../models/authorModel')


//### POST /blogs
// - Create a blog document from request body. Get authorId in request body only.
// - Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
// - Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#successful-response-structure) 
// - Create atleast 5 blogs for each author

// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

const createBlog = async (req, res) => {
    try {
        // taking data from body
        const newBlog = req.body
        const id = newBlog.authorId

        if (!newBlog.title) { return res.status(400).send({ status: false, msg: "> Title is required" }) }         //Title is mandory
        if (!newBlog.body) { return res.status(400).send({ status: false, msg: "> Body is required" }) }           //body is mandory
        if (!newBlog.authorId) { return res.status(400).send({ status: false, msg: "> Category is required" }) }   //category is mandory
        if (!newBlog.category) { return res.status(400).send({ status: false, msg: "> AuthorId is required" }) }   //authorId is mandory

        //finding by authorId
        const validateId = await AuthorModel.findById(id)
        //check valid authorId
        if (!validateId) return res.status(404).send({ status: false, msg: ">> AuthorId is invalid" })

        const data = await BlogModel.create(newBlog)   //create blog
        res.status(201).send({ status: true, data: data })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


// ### GET /blogs
// - Returns all blogs in the collection that aren't deleted and are published
// - Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
// - If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
// - Filter blogs list by applying filters. Query param can have any combination of below filters.
//   - By author Id
//   - By category
//   - List of blogs that have a specific tag
//   - List of blogs that have a specific subcategory
// example of a query url: blogs?filtername=filtervalue&f2=fv2


const getBlogs = async (req, res) => {
    try {
        let query = req.query;
        let filter = {
            isDeleted: false,
            isPublished: true,

            //** using spread to add queries taken from req **// 
            ...query
        }
        // passing the filter variable inside find for validation
        let allBlogs = await BlogModel.find(filter)
        if (allBlogs.length == 0) return res.status(404).send({ status: false, msg: ">> No blog found" })

        res.status(200).send({ status: true, data: allBlogs })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



module.exports = { createBlog, getBlogs }