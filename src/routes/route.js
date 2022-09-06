// importing express // creating router
const express = require('express');
const router = express.Router();

// importing controllers
const AuthorController = require("../controllers/authorController");
const BlogController = require("../controllers/blogController");



//**    APIS   **//

// post Apis
router.post("/authors", AuthorController.createAuthor);
router.post("/blogs", BlogController.createBlog);

// get Apis
router.get("/getBlogs", BlogController.getBlogs);

// put Apis
router.put('/blogs/:blogId', BlogController.updateBlog);

// delete Apis
router.delete('/blogs/:blogId', BlogController.deleteBlogById);
router.delete('/blogs', BlogController.deleteBlogByQueryParam);




module.exports = router;