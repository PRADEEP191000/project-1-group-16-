const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Project-1:6H3EsS0qOKLtWR0B@cluster0.hln3nud.mongodb.net/Project-1?retryWrites=true&w=majority",
    {
        useNewUrlParser: true
    })
    .then(() => console.log("Database connected..."))
    .catch(err => console.log(err));


app.use('/', route);
app.use((req, res, next) => {
    const err = new Error('/ Path not found /');
    return res.status(404).send({status: 'ERROR', error: err.message})
});


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app listening on port ' + (process.env.PORT || 3000))
});
