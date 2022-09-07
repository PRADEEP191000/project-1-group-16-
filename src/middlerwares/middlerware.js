const jwt=require('jsonwebtoken');
const express = require('express');

//==================================Authentication=========================//

const Authentication = function (req, res, next) {
    try {
  
  
      // console.log(req)
      let token = req.headers["x-api-key"]
      
      if (!token) return res.status(400).send({ status: false, msg: "token is required" })
    
      let decodedToken = jwt.verify(token, "project-1")
      if (!decodedToken) return res.status(400).send({ status: false, msg: " token is invalid" })
      
      req.decodedToken = decodedToken;
      // console.log(req.decodedToken)
  
      next()
    }
  catch (err) {
      console.log("This is the error:", err.message)
      res.status(500).send({ msg: "Error", error: err.message })
    }
  };

  //===============================================authorisation=============================================//

  const authorise = async function (req, res, next) {
    try {
  
      const blogId = req.params.blogId;
      const blog = await BlogModel.findById(blogId);

      if (!blog) {
        return res.status(400).send({ status: false, msg: "Blog Not Found" })
      }
      const authorId = blog.authorId;
  
        if (token.authorId != authorId)
          return res.status(403).send({
            msg: 'FORBIDDEN',
            error: 'User logged is not allowed to modify the requested users data',
          });
      next();
    } catch (err) {
      console.log('This is the error :', err.message);
      res.status(500).send({ msg: 'Error', error: err.message });
    }
  };

  module.exports = {Authentication, authorise}