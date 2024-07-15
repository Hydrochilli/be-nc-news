const { selectArticleByID} = require('../models/articles.models');


exports.getArticleByID = async (req, res, next) => {
   
    const { article_id } = req.params; 
    try{
    const article = await selectArticleByID(article_id);
        res.status(200).send({ article })

    }catch(error){
        next(error)
    }
}