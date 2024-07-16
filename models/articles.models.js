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
        SELECT articles. *,
                COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments on articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC
        `)

    return articles.rows
}
