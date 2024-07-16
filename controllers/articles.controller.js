const { selectArticleByID, selectAllArticles} = require('../models/articles.models');


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
    
        const formattedArticles = articles.map(article => {
            const {body, ...rest} = article
            return rest
        })
        res.status(200).send({ articles: formattedArticles})
    } catch (error) {
        next(error)
    }
    }
