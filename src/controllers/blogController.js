const BlogModel = require("../models/blogModel");
const AuthorModel = require('../models/authorModel');


//### POST /blogs
// - Create a blog document from request body. Get authorId in request body only.
// - Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
// - Return HTTP status 201 on a succesful blog creation. Also return the blog document. The response should be a JSON object like [this](#successful-response-structure) 
// - Create atleast 5 blogs for each author

// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

const createBlog = async (req, res) => {
    try {
        // taking data from body
        const newBlog = req.body;
        const id = newBlog.authorId;

        // checking all the required fields are present or not(sending error msg according to that)
        if (!newBlog.title) { return res.status(400).send({ status: false, msg: "Title is required" }) };
        if (!newBlog.body) { return res.status(400).send({ status: false, msg: "Body is required" }) };
        if (!newBlog.authorId) { return res.status(400).send({ status: false, msg: "Category is required" }) };
        if (!newBlog.category) { return res.status(400).send({ status: false, msg: "AuthorId is required" }) };

        //finding by authorId
        const validateId = await AuthorModel.findById(id);
        //check valid authorId
        if (!validateId) return res.status(404).send({ status: false, msg: "AuthorId is invalid" });

        // creating new blog
        const data = await BlogModel.create(newBlog);
        res.status(201).send({ status: true, data: data });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
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
        // taking all queries from query param
        let queries = req.query;

        // creating an object with our desired data throu which we have to find
        let filterData = {
            isDeleted: false,
            isPublished: true,
            //** using spread to add queries taken from req **// 
            ...queries
        };

        // passing the filter variable inside find for validation
        let allBlogs = await BlogModel.find(filterData);
        if (allBlogs.length == 0) return res.status(404).send({ status: false, msg: "No blog found" });

        // sending response
        res.status(200).send({ status: true, data: allBlogs });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

// ### PUT /blogs/:blogId
// - Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// - Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// - Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
// - Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
// - Also make sure in the response you return the updated blog document. 

const updateBlog = async (req, res) => {

    try {
        // taking blogId from params and checking that it's present
        let blogId = req.params.blogId

        // finding the blogId inside BlogModel
        let validateBlogId = await BlogModel.findById(blogId)
        if (!validateBlogId) return res.status(404).send({ status: false, msg: "invalid blogId" });

        // taking details from the body
        let details = req.body;

        // updating that blog with findOneAndUpdate
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: blogId },
            {
                $push: { tags: details.tags, subcategory: details.subcategory },
                title: details.title, body: details.body, authorId: details.authorId, isPublished: true, publishedAt: Date.now()
            },
            { new: true, upsert: true }
        );

        res.status(200).send({ status: true, data: updatedBlog });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


//### DELETE /blogs/:blogId
// - Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

const deleteBlogById = async (req, res) => {
    try {
        // taking blogId from params
        let blogId = req.params.blogId;

        // validating blogId
        let dataBlogId = await BlogModel.findById(blogId);
        if (!dataBlogId) return res.status(404).send({ status: false, msg: "Blog is not exist" });

        // deleting that perticular doc
        let deleteBlog = await BlogModel.updateOne(
            { _id: blogId, isDeleted: false },
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        );
        res.status(200).send({ status: true, msg: "document deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


//### DELETE /blogs?queryParams
// - Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// - If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)


const deleteBlogByQueryParam = async (req, res) => {
    try {
        // taking queries
        let queries = req.query;
        if (!queries) return res.status(404).send({ status: false, msg: "no queries present to delete" });

        // validating queries inside BlogModel
        let filterByQuery = await BlogModel.find(queries);
        if (filterByQuery.length == 0) return res.status(404).send({ status: false, msg: "No blog found to delete" });

        // deleting documents according to the query param inputs
        // according to those data there will may be a scenario where we have to update many docs
        // thats'why we are using updateMany
        let deletedBlogDetails = await BlogModel.updateMany(
            queries,
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        );
        res.status(200).send({ status: true, msg: "document deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


module.exports = { createBlog, getBlogs, updateBlog, deleteBlogById, deleteBlogByQueryParam };