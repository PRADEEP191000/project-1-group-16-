
const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const BlogController= require("../controllers/blogController")


router.post("/authors", authorController.createAuthor  );
router.post("/blogs", BlogController.createBlog  )




module.exports = router;