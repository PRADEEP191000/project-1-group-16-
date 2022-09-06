const AuthorModel = require("../models/authorModel")


//### Author APIs /authors
// - Create an author - atleast 5 authors
// - Create a author document from request body.
//   `Endpoint: BASE_URL/authors`

const createAuthor = async (req, res) => {
    try {
        // taking document from body
        let author = req.body;
        // checking anything inputted or not
        if (!author) res.status(401).send({ status: false, msg: "nothing found from body" });

        // checking all the required fields are present or not(sending error msg according to that)
        if (!author.fname) { return res.status(400).send({ status: false, msg: "First name is required" }) };
        if (!author.lname) { return res.status(400).send({ status: false, msg: "Last name is required" }) };
        if (!author.title) { return res.status(400).send({ status: false, msg: "Title is required" }) };
        if (!author.email) { return res.status(400).send({ status: false, msg: "Email is required" }) };
        if (!author.password) { return res.status(400).send({ status: false, msg: "Password is required" }) };


        // validating fields with REGEX formats
        const validateFName = (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(author.fname));
        const validateLName = (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(author.lname));
        const validateEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(author.email));


        if (!validateFName) return res.status(400).send({ status: false, msg: "First Name is invalid, Please check your First Name" });
        if (!validateLName) return res.status(400).send({ status: false, msg: "Last Name is invalid, Please check your Last Name" });
        if (!validateEmail) return res.status(400).send({ status: false, msg: "Email is invalid, Please check your Email address" });

        // creating new author
        let authorCreated = await AuthorModel.create(author);
        res.status(201).send({ status: true, data: authorCreated });
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

module.exports = { createAuthor }