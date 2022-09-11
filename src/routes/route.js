// importing express // creating router
const express = require('express');
const router = express.Router();

// importing controllers
const MW = require('../middlewares/commonMiddleware')
const AuthorController = require("../controllers/authorController");
const BlogController = require("../controllers/blogController");



//**    APIS   **//

// Author apis
router.post("/login", AuthorController.login);
router.post("/authors", AuthorController.createAuthor);

// blogs apis
router.post("/blogs", MW.authenticateAuthor, BlogController.createBlog);
router.get("/getBlogs", MW.authenticateAuthor, BlogController.getBlogs);
router.put('/blogs/:authorId/:blogId', MW.authenticateAuthor, MW.authoriseAuthor, BlogController.updateBlog);

// delete apis
router.delete('/blogs/:authorId/:blogId', MW.authenticateAuthor, MW.authoriseAuthor, BlogController.deleteBlogById);
router.delete('/blogs/:authorId', MW.authenticateAuthor, MW.authoriseAuthor, BlogController.deleteBlogByQueryParam);



module.exports = router;