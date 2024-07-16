const db = require('../db/connection')

exports.selectArticleByID = async(article_id) => {
const {rows} = await db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
if(rows.length === 0) {
    return Promise.reject({status: 404, message: 'No article with that ID'
    
    })
}

return rows[0] 

}
exports.selectAllArticles = async () => {
    const articles = await db.query(`
        SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,
                COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments on articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC
        `)

    return articles.rows
}
exports.selectArticleCommentsByID = async (article_id) => {
    const confirmArticle = await db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    if(confirmArticle.rows.length === 0) {
        return Promise.reject({ status: 404, message: 'No article with that ID'})
    }
    
    const { rows } = await db.query(
      'SELECT article_id,comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',
      [article_id])
       if(rows.length === 0) {
         return []
  
    }
  return rows;
}
