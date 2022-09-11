const BlogModel = require("../models/blogModel");
const AuthorModel = require('../models/authorModel');
const GlobalFunctions = require('../controllers/globalFunctions');
const ObjectId = require('mongoose').Types.ObjectId



//**     /////////////////////////      Createblog      //////////////////////       **//
const createBlog = async (req, res) => {
    try {
        // taking data from body
        let blogData = req.body
        // using destructuring of object (as we get data as json obj from postman), using ...rest to add all of the rest of the fields (which we need at the time of cretaion new doc)
        // here we defining the key name we are getting from body and then we can call them with this defined name
        let { title, body, authorId, category, isPublished, tags, subcategory, ...rest } = req.body

        //checking that there is data inside body
        if (!GlobalFunctions.checkInputs(blogData)) return res.status(404).send({ status: false, msg: "please provide details to create a blog" })

        //checking if any other attributes (keys) in req body is present or not (which we don't required to save)
        if (GlobalFunctions.checkInputs(rest) > 0) return res.status(400).send({ status: false, msg: "please provide required details only => title, body, authorId, category, isPublished " });

        // checking all the required fields are present or not(sending error msg according to that)
        if (!GlobalFunctions.isValidInput(title)) return res.status(400).send({ status: false, msg: "Title is required [ in string ] " });
        if (!GlobalFunctions.isValidInput(body)) return res.status(400).send({ status: false, msg: "Body is required [ in string ] " });
        if (!GlobalFunctions.isValidInput(authorId)) return res.status(400).send({ status: false, msg: "AuthorId is required [ in string ] " });
        if (!category) return res.status(400).send({ status: false, msg: "Category is required [ in array of strings ] " });

        // checking that the authorId which is given is that in a perfect _id format .i.e. is it a hex value or not 
        // every ObjectId has a specific format (we saw _id creates automatically and it's unique too )     // _id: creates with a hex value (0-9, a-f)
        if (!ObjectId.isValid(authorId)) return res.status(400).send({ status: false, msg: "AuthorId is invalid" });

        //finding by authorId
        const validateAuthorId = await AuthorModel.findById(authorId);
        //check valid authorId
        if (!validateAuthorId) return res.status(400).send({ status: false, msg: "Author is not present, create author first" });

        // creating new blog
        const data = await BlogModel.create(blogData);

        if (isPublished) {
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

        // taking all queries from query param and destructuring
        let queries = req.query
        let { tags, category, subcategory, authorId, ...rest } = req.query;

        //checking if any other attributes (keys) in req query is present or not (which we don't required)
        if (GlobalFunctions.checkInputs(rest)) return res.status(404).send({ status: false, msg: "please provide query between valid credentials only => tags, category, subcategory, authorId" });

        // checking that if authorId present , provided authorId's format is a hex value (common format for all ids in mongo DB)
        if (authorId && (!ObjectId.isValid(authorId))) return res.status(404).send({ status: false, msg: "provided authorId is invalid" });

        // passing the queries variable inside find, desired filterisation too for validation
        let allBlogs = await BlogModel.find({
            $and: [queries, { isDeleted: false, isPublished: true }]
        });
        if (allBlogs.length == 0) return res.status(404).send({ status: false, msg: "No blog found" });

        // sending response
        res.status(200).send(
            {
                status: true,
                choice: 'customize result can be obtained with query param inputs',
                data: allBlogs
            }
        );
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

//**     /////////////////////////      updateBlog      //////////////////////  /blogs/:blogId      **//
const updateBlog = async (req, res) => {

    try {

        // taking the userId who is requesting this route
        let requestingAuthor = req.requestingAuthor
        // taking the blog from authorise middleware
        let searchedBlog = req.foundBlog
        // extracting authorId from blog
        let authorIdFromBlog = searchedBlog['authorId'].toString();

        // getting blog from middleware(authorisation) in searchedBlog variable
        if (!searchedBlog) return res.status(404).send({ status: false, msg: "invalid blogId" });
        // checking that both author are same
        if (requestingAuthor != authorIdFromBlog) return res.status(404).send({ status: false, msg: "author has no permission to change other's blog" });


        // taking details from the body
        let details = req.body;
        // destructuring 
        let { title, body, authorId, category, isPublished, tags, subcategory, ...rest } = req.body

        // checking that if authorId present , provided authorId's format is a hex value (common format for all ids in mongo DB)
        if (authorId && (!ObjectId.isValid(authorId))) return res.status(404).send({ status: false, msg: "provided authorId in request body is invalid" });

        //checking if any other attributes (keys) in req body is present or not (which we don't required to save)
        if (GlobalFunctions.checkInputs(rest)) return res.status(400).send({ status: false, msg: "please request with acceptable fields only => title, body, authorId, category, isPublished, tags, subcategory to update your document" })


        // taking blogId (provided in params) from middleware/authorisation 
        let blogIdFromParams = req.blogIdFromParams;
        // checking the blogId(path params) format is in hex value
        if (!ObjectId.isValid(blogIdFromParams)) return res.status(404).send({ status: false, msg: 'invalid blogId provided in path params' })

        let checkBlog = await BlogModel.findById(blogIdFromParams)
        if (checkBlog['isDeleted'] == true) return res.status(404).send({ status: false, msg: "requested document has already deleted" });

        // updating that blog with findOneAndUpdate
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: blogIdFromParams },
            {
                $push: { tags: details.tags, subcategory: details.subcategory, category: details.category },
                $set: { title: details.title, body: details.body, authorId: details.authorId, isPublished: true, publishedAt: new Date() }
            },
            { new: true }
        );
        res.status(200).send({ status: true, data: updatedBlog });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

//**     /////////////////////////      deleteBlog by ID     //////////////////////  /blogs/:blogId      **//
const deleteBlogById = async (req, res) => {
    try {
        // blogId from middlewares/authorise
        let blogIdFromParams = req.blogIdFromParams;
        // checking the blogId(path params) format is in hex value
        if (!ObjectId.isValid(blogIdFromParams)) return res.status(404).send({ status: false, msg: 'invalid blogId provided in path params' })

        // authorId who is requesting route (from params)
        let requestingAuthorId = req.requestingAuthor
        // getting blog from middleware(authorisation) 
        let isBlogIdPresentDb = req.foundBlog

        // validating blogId
        if (!isBlogIdPresentDb) return res.status(404).send({ status: false, msg: "Blog is not exist" });
        // authorId found from blog
        let authorIdFromReqBlog = isBlogIdPresentDb['authorId']

        // checking that the author who requesting route is trying to delete his own blog 
        if (requestingAuthorId != authorIdFromReqBlog) return res.status(404).send({ status: false, msg: "author has no permission to delete other's blog" });

        // checking that the found document's isDeleted key is true or not
        if (isBlogIdPresentDb.isDeleted === true) return res.status(404).send({ status: false, msg: "you are requesting to delete already deleted blog" });

        // deleting that perticular doc
        let deleteBlog = await BlogModel.updateOne(
            { _id: blogIdFromParams },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
        res.status(200).send({ status: true, msg: "document deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

//**     /////////////////////////      deleteBlog  by query    //////////////////////  /blogs?queryParams      **//
const deleteBlogByQueryParam = async (req, res) => {
    try {
        // taking the userId who is requesting this route
        let requestingAuthorId = req.requestingAuthor
        // taking queries
        let queries = req.query;
        if (!GlobalFunctions.checkInputs(queries)) return res.status(404).send({ status: false, msg: "please add queries" });

        let { tags, category, subcategory, authorId, isPublished, ...rest } = req.query;

        if (GlobalFunctions.checkInputs(rest)) return res.status(400).send({ status: false, msg: " please provide valide filter key in query => tags, category, subcategory, authorId, isPublished only" })

        if (!authorId || (authorId != requestingAuthorId)) req.query.authorId = requestingAuthorId;

        // validating queries inside BlogModel
        // filterByQuery returns an array of objects
        let filterByQuery = await BlogModel.find(queries, { isDeleted: false });
        if (filterByQuery.length == 0) return res.status(404).send({ status: false, msg: "No blog found to delete" });

        // let isDeletedFalseId = filterByQuery.map((data) => data._id.toString())

        // let updatedArr = []
        // for (id in isDeletedFalseId) {
        //     let deleteData = await BlogModel.findOneAndUpdate(
        //         { _id: id },
        //         { isDeleted: true, deletedAt: new Date() },
        //         { new: true }
        //     );
        //     updatedArr.push(deleteData)
        // }

        // deleting documents according to the query param inputs
        // according to those data there will may be a scenario where we have to update many docs
        // thats'why we are using updateMany
        
        let deletedBlogDetails = await BlogModel.updateMany(
            // using $and to target those docs matching with queries taken and those are not deleted
            { $and: [queries, { isDeleted: false }] },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        );
        res.status(200).send({ status: true, msg: "matched document deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}



module.exports = { createBlog, getBlogs, updateBlog, deleteBlogById, deleteBlogByQueryParam };