const AuthorModel= require("../models/authorModel")


//### Author APIs /authors
// - Create an author - atleast 5 authors
// - Create a author document from request body.
//   `Endpoint: BASE_URL/authors`

const createAuthor= async function (req, res) {
    try {
        let author = req.body
        if (!author) res.status(401).send({status: false, mesg: ">> nothing found from body..."})
        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({status: true, data: authorCreated})
    } catch (err) {
        res.status(400).send({status: "error", error: err.message})
    }
}

module.exports = { createAuthor }