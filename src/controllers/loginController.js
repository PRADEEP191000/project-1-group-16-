const JWT = require('jsonwebtoken')
const AuthorModel = require('../models/authorModel')

// ### POST /login
// - Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId in response body like [this](#Successful-login-Response-structure)
// - If the credentials are incorrect return a suitable error message with a valid HTTP status code
const login = async (req, res) => {

    try {

        // taking EmailId and Password from body and checking both are present
        let authorEmail = req.body.email
        let authorPassword = req.body.password

        if (!authorEmail && !authorPassword) return res.status(404).send({ status: false, msg: "please enter EmailId" })
        if (!authorEmail) return res.status(404).send({ status: false, msg: "please enter EmailId" })
        if (!authorPassword) return res.status(404).send({ status: false, msg: "please enter Password" })

        // finding that particular user/author inside AuthorModel  
        let Author = await AuthorModel.findOne({ email: authorEmail, password: authorPassword })
        if (!Author) return res.status(404).send({ status: false, msg: "incorrect emailId or password" });

        // creating token
        let token = JWT.sign(
            {
                userId: Author._id.toString(),
                creationTime: Date.now(),
                type: 'blogging-site-project'
            },
            "-- plutonium-- project-blogging-site -- secret-token --"
        )
        // sending the token in response header
        res.setHeader("x-api-key", token);

        return res.status(201).send({ status: true, data: token })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

module.exports = { login }