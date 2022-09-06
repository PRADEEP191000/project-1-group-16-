const BlogModel = require("../models/blogModel")
const AuthorModel = require('../models/authorModel')

//=============================createBlog=====================================//

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

//=======================================================getblog===================================//

const getBlogs = async (req, res) => {
    try {
        let queries = req.query;
        let filterData = {
            isDeleted: false,
            isPublished: true,

            //** using spread to add queries taken from req **// 
            ...queries
        }
        // passing the filter variable inside find for validation
        let allBlogs = await BlogModel.find(filterData)
        if (allBlogs.length == 0) return res.status(404).send({ status: false, msg: ">> No blog found" })

        res.status(200).send({ status: true, data: allBlogs })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
};
//===========================put/Blog/blogId=======================//

const updateBlog = async (req, res) => {

    try {
        // taking blogId from params and checking that it's present
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ status: false, msg: ">> blogId required in params" })

        // finding the blogId inside BlogModel
        let validateBlogId = await BlogModel.findById(blogId)
        if (!validateBlogId) return res.status(400).send({ status: false, msg: ">> invalid blogId" })

        // taking details from the body
        let details = req.body

        // updating that blog with findOneAndUpdate
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: blogId },
            {
                title: details.title, body: details.body, authorId: details.authorId, tags: details.tags, category: details.category,
                subcategory: details.subcategory, isPublished: true, publishedAt: Date.now()
            },
            { new: true, upsert: true }
        )

        res.status(200).send({ status: true, data: updatedBlog })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}

//============================deleteById======================================//

const deleteBlogById = async (req, res) => {
    try {
        // taking blogId from params
        let blogId = req.params.blogId

        // validating blogId
        let dataBlogId = await BlogModel.findById(blogId)
        if (!dataBlogId) return res.status(400).send({ status: false, msg: "BlogId not valid" })

        let deleteBlog = await BlogModel.updateOne(
            { _id: blogId },
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        )
        res.status(200).send({ status: true, msg: ">> document deleted successfully" })
        //{ msg: "Blog has been deleted successfully", data: deleteBlog }
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


//========================deleteWithQueryParams======================================//

const deleteBlogByQueryParam = async (req, res) => {
    try {
        // taking queries
        let queries = req.query;
        if (!queries) return res.status(404).send({ status: false, msg: "> no queries present to delete" })
        
        // validating queries inside BlogModel
        let filterByQuery = await BlogModel.find(queries)
        if (filterByQuery.length == 0) return res.status(404).send({ status: false, msg: "> No blog found to delete" })

        // deleting documents according to the query param inputs
        // according to those data there will may be a scenario where we have to update many docs
        // thats'why we are using updateMany
        let deletedBlogDetails = await BlogModel.updateMany(
            queries,
            { $set: { isDeleted: true, deletedAt : new Date() } },
            { new: true }
        )
        res.status(200).send({ status: true, msg: ">> document deleted successfully" })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


module.exports = { createBlog, getBlogs, updateBlog, deleteBlogById, deleteBlogByQueryParam }
