const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Project-1:6H3EsS0qOKLtWR0B@cluster0.hln3nud.mongodb.net/Practice",
    {
        useNewUrlParser: true
    })
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.use((req, res, next) =>{
    const error = new Error(' path not found insert correct fath.');
    return res.status(404).send({status: "error", error:error.message})
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
