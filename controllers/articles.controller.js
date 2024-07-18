const { selectArticleByID, selectAllArticles, selectArticleCommentsByID, insertArticleCommentByID, updateArticleVotesByID} = require('../models/articles.models');


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
    }else{
   
    res.status(200).send({ comments });
  }
}catch(error){
    next(error)
  }
};
exports.addArticleCommentByID= async (req, res, next) => {
    try {
      const { article_id } = req.params;
      const { username, body } = req.body;
     
      const comment = await insertArticleCommentByID(article_id, username, body);
     
      res.status(201).send({ comment });
  
    } catch (error) {
      next(error);
    }
  }
  exports.patchArticleVotesByID = async (req, res, next) => {
    const { article_id} = req.params
    const {inc_votes} = req.body

    try{
      const updatedArticle = await updateArticleVotesByID(article_id, inc_votes)
      res.status(200).send({article: updatedArticle }) 
    } catch(error) {
      next(error)
    }
    }
    
  