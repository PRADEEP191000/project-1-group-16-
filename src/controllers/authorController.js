const AuthorModel = require("../models/authorModel")


//### Author APIs /authors
// - Create an author - atleast 5 authors
// - Create a author document from request body.
//   `Endpoint: BASE_URL/authors`

const createAuthor = async (req, res) => {
    try {
        let author = req.body
        if (!author) res.status(401).send({ status: false, msg: ">> nothing found from body..." })
        if (!author.fname) { return res.status(400).send({ status: false, msg: "> First name is required" }) }  //Firstname is mandatory  
        if (!author.lname) { return res.status(400).send({ status: false, msg: "> Last name is required" }) }  //Last name is mandatory
        if (!author.title) { return res.status(400).send({ status: false, msg: "> Title is required" }) }      //Title is mandatory
        if (!author.email) { return res.status(400).send({ status: false, msg: "> Email is required" }) }      //Email is mandatory
        if (!author.password) { return res.status(400).send({ status: false, msg: "> Password is required" }) }//Password is mandatory


        // validating fields with REGEX formats
        const validateFName = (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(author.fname))
        const validateLName = (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(author.lname))
        const validateEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(author.email))


        if (!validateFName) return res.status(400).send({ status: false, msg: ">> First Name is invalid, Please check your First Name" })
        if (!validateLName) return res.status(400).send({ status: false, msg: ">> Last Name is invalid, Please check your Last Name" })
        if (!validateEmail) return res.status(400).send({ status: false, msg: ">> Email is invalid, Please check your Email address" })

        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status: true, data: authorCreated })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}

module.exports = { createAuthor }