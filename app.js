const { getAllTopics } = require('./controllers/topics.controller');


const express = require('express');
const app = express();





app.get('/api/topics', getAllTopics)

app.use('/*', (req, res, next) => {
    res.status(404).send({ message: 'route is invalid' });
  });

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({message: err.message})
    }else{
        next(err)
    }
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: 'Internal server error' });
  });





module.exports = app