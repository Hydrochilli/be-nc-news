const { selectArticleByID, selectAllArticles, selectArticleCommentsByID} = require('../models/articles.models');


exports.getArticleByID = async (req, res, next) => {
   
    const { article_id } = req.params; 
    try{
    const article = await selectArticleByID(article_id);
        res.status(200).send({ article })

    }catch(error){
        next(error)
    }
}
exports.getAllArticles = async (req, res, next) => {
    
    try {
        const articles = await selectAllArticles()
    
        res.status(200).send({ articles })
    } catch (error) {
        next(error)
    }
    }

exports.getArticleCommentsByID = async(req, res, next) => {


    const { article_id } = req.params;
    try{
    const comments = await selectArticleCommentsByID(article_id)
    if(comments.length === 0){
        res.status(200).send({message: 'No comments found for article_id'})
    }
   
    res.status(200).send({ comments });
  }catch(error){
    next(error)
  }
}
