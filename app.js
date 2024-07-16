const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controller');
const {getEndpoint} = require('./controllers/endpoints.controller')
const {getArticleByID, getAllArticles} = require('./controllers/articles.controller')





app.get('/api', getEndpoint)
app.get('/api/topics', getAllTopics)
app.get('/api/articles/:article_id', getArticleByID)
app.get('/api/articles', getAllArticles)

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
app.use((err,req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({message: 'Input must be a number'})
  
    } else if (err.code === '42601') {
        res.status(400).send({ message: 'Syntax error'})
    } else if (err.code === '42P01') {
        res.status(400).send({message: 'Table Undefined'})
    } else if (err.code === '08001') {
        res.status(500).send({message: 'Unable to establish SQL connection'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: 'Internal server error' });
  });





module.exports = app