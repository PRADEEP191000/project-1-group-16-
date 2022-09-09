const BlogModel = require("../models/blogModel");
const AuthorModel = require('../models/authorModel');

//**     /////////////////////////      Createblog      //////////////////////       **//
const createBlog = async (req, res) => {
    try {
        // taking data from body
        const newBlog = req.body;

        //checking that there is data inside body
        if (Object.keys(newBlog) == 0) return res.status(404).send({ status: false, msg: "please provide details" })

        // checking all the required fields are present or not(sending error msg according to that)
        if (!newBlog.title) return res.status(400).send({ status: false, msg: "Title is required" });
        if (!newBlog.body) return res.status(400).send({ status: false, msg: "Body is required" });
        if (!newBlog.authorId) return res.status(400).send({ status: false, msg: "AuthorId is required" });
        if (!newBlog.category) return res.status(400).send({ status: false, msg: "Category is required" });

        //finding by authorId
        let authorId = newBlog['authorId']
        const validateAuthorId = await AuthorModel.findById(authorId);
        //check valid authorId
        if (!validateAuthorId) return res.status(404).send({ status: false, msg: "AuthorId is invalid" });

        // creating new blog
        const data = await BlogModel.create(newBlog);

        if (newBlog.isPublished === true) {
            data.publishedAt = new Date();
            data.save();
        }

        res.status(201).send({ status: true, data: data });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


//**     /////////////////////////      getBlogs      //////////////////////       **//
const getBlogs = async (req, res) => {
    try {
        // taking all queries from query param
        let queries = req.query;
        // passing the queries variable inside find, desired filterisation too for validation
        let allBlogs = await BlogModel.find({
            $and: [queries, { isDeleted: false, isPublished: true }]
        });
        if (allBlogs.length == 0) return res.status(404).send({ status: false, msg: "No blog found" });

        // sending response
        res.status(200).send({ status: true, data: allBlogs });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


//**     /////////////////////////      updateBlog      //////////////////////  /blogs/:blogId      **//
const updateBlog = async (req, res) => {

    try {

        // taking the userId who is requesting to change
        let requestingAuthor = req.requestingAuthor

        // taking the blog from authorise middleware
        let blog = req.foundBlog
        // getting blog from middleware(authorisation) 
        if (!blog) return res.status(404).send({ status: false, msg: "invalid blogId" });

        // taking blogId
        let blogId = req.blogId;

        // extracting authorId from blog
        let authorIdFromBlog = blog.authorId.toString();

        // checking that both author are same
        if (requestingAuthor != authorIdFromBlog) return res.status(404).send({ status: false, msg: "author has no permission to change other's blog" });

        // taking details from the body
        let details = req.body;

        let check = await BlogModel.findById(blogId)
        if (check['isDeleted'] == true) return res.status(404).send({ status: false, msg: "requested document has already deleted" });

        // updating that blog with findOneAndUpdate
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: blogId },
            {
                $push: { tags: details.tags, subcategory: details.subcategory, category: details.category },
                $set: { title: details.title, body: details.body, authorId: details.authorId, isPublished: true, publishedAt: Date.now() }
            },
            { new: true }
        );
        res.status(200).send({ status: true, data: updatedBlog });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


//**     /////////////////////////      deleteBlog      //////////////////////  /blogs/:blogId      **//
const deleteBlogById = async (req, res) => {
    try {
        // blogId from middlewares/authorise
        let blogId = req.blogId;
        // getting blog from middleware(authorisation) 
        let isBlogIdPresentDb = req.foundBlog
        // authorId who is requesting route
        let requestingAuthorId = req.requestingAuthor
        // authorId found from blog
        let authorIdFromReqBlog = isBlogIdPresentDb['authorId']

        // validating blogId
        if (!isBlogIdPresentDb) return res.status(404).send({ status: false, msg: "Blog is not exist" });

        // checking that the author who requesting route is trying to delete his own blog 
        if ( requestingAuthorId != authorIdFromReqBlog) return res.status(404).send({ status: false, msg: "author has no permission to delete other's blog" });

        // checking that the found document's isDeleted key is true or not
        if (isBlogIdPresentDb.isDeleted === true) return res.status(404).send({ status: false, msg: "you are requesting to delete already deleted blog" });

        // deleting that perticular doc
        let deleteBlog = await BlogModel.updateOne(
            { _id: blogId },
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        );
        res.status(200).send({ status: true, msg: "document deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


//**     /////////////////////////      deleteBlog      //////////////////////  /blogs?queryParams      **//
const deleteBlogByQueryParam = async (req, res) => {
    try {
        // taking queries
        let queries = req.query;
        if (!queries) return res.status(404).send({ status: false, msg: "please add queries" });

        // validating queries inside BlogModel
        // filterByQuery returns an array of objects
        let filterByQuery = await BlogModel.find(queries);
        if (filterByQuery.length == 0) return res.status(404).send({ status: false, msg: "No blog found to delete" });

        // deleting documents according to the query param inputs
        // according to those data there will may be a scenario where we have to update many docs
        // thats'why we are using updateMany
        let deletedBlogDetails = await BlogModel.updateMany(
            // using $and to target those docs matching with queries taken and those are not deleted
            { $and: [queries, { isDeleted: false }] },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true }
        );
        res.status(200).send({ status: true, msg: "document deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}



module.exports = { createBlog, getBlogs, updateBlog, deleteBlogById, deleteBlogByQueryParam };