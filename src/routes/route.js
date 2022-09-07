
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const authenMiddler= require('../middlerwares/middlerware');
const AuthorController = require("../controllers/authorController")
const BlogController = require("../controllers/blogController")


router.post("/authors", AuthorController.createAuthor);
router.post("/blogs", BlogController.createBlog)
router.get("/getBlogs", authenMiddler.Authentication, BlogController.getBlogs)
router.put('/blogs/:authorId/:blogId', authenMiddler.Authentication,authenMiddler.authorise, BlogController.updateBlog);
router.delete('/blogs/:blogId', BlogController.deleteBlogById);
router.delete('/blogs', BlogController.deleteBlogByQueryParam);
router.post("/login", AuthorController.loginAuthor)


module.exports = router;