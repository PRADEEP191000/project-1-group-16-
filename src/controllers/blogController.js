const BlogModel= require("../models/blogModel")

const createBlog= async function (req, res) {
    try {
        let blog = req.body
        let author_id = blog.authorId
        if (!author_id){
            return res.status(400).send({msg: "Author Id is required"})
        } else if (!await AuthorModel.findById({_id: author_id})){
            return res.status(400).send({msg: "Invalid Author Id"})
        }
        const blogCreated = await BlogModel.create(blog)
        res.status(200).send({status: true, data: blogCreated})
    } catch (err) {
        res.status(400).send({status: "error", error: err.message})
    }
}

module.exports = { createBlog }