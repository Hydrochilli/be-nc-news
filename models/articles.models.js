const db = require('../db/connection')

exports.selectArticleByID = async(article_id) => {
    if(isNaN(article_id)) {
        return Promise.reject({ status: 400, message: 'Input must be a number'})
    }
    const articleQuery =`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url,
     COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;
const {rows} = await db.query(articleQuery, [article_id])
if(rows.length === 0) {
    return Promise.reject({status: 404, message: 'No article with that ID' })
    
   
}

return rows[0] 

}
exports.selectAllArticles = async (sort_by = 'created_at', order = 'desc', topic) => {
    const greenlistSortBy = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url']
    const greenlistOrder = [ 'asc', 'desc']
    if(!greenlistSortBy.includes(sort_by) || !greenlistOrder.includes(order))
        return Promise.reject({status: 400, message: 'Invalid query request'})


    
    const topicArray = []
     let queryString = `
        SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,
                COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments on articles.article_id = comments.article_id
       `;
       
       if(topic) {
        queryString += `WHERE topic = $1`
        topicArray.push(topic)
       }

       queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
        
      const articles = await db.query(queryString, topicArray)
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
exports.insertArticleCommentByID = async (article_id, username, body) => {

    if(!username|| !body) {
        return Promise.reject({status: 400, message:  'request body invalid'})
    }
    const confirmUser = await db.query('SELECT * FROM users WHERE username = $1;', [username])
    if(confirmUser.rows.length === 0) {
        return Promise.reject({status: 404, message: 'user does not exist'})
    }
    
    const confirmArticle = await db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    if(confirmArticle.rows.length === 0) {
        return Promise.reject({ status: 404, message: 'No article with that ID'})
    }
    const { rows } = await db.query(
        `INSERT INTO comments (article_id, author, body)
         VALUES ($1, $2, $3)
         RETURNING *;`,
        [article_id, username, body]
    )
    
    return rows[0];
};
exports.updateArticleVotesByID = async(article_id, inc_votes) => {
    if (!inc_votes || typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, message: 'invalid request body'})
    }

    const {rows} = await db.query(
        `UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [inc_votes, article_id]
    )
    if(rows.length === 0) {
        return Promise.reject({ status:  404, message: 'No article with that ID'})
    }
    return rows[0]
}

exports.removeCommentByCommentID = async (comment_id) => {
    const {rowCount} = await db.query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
    if(rowCount === 0) {
        return Promise.reject({status: 404, message: 'No comment with that ID'})
    }
}

exports.selectAllUsers = async () => {
    const {rows} = await db.query(`
        SELECT username, name, avatar_url
         FROM users       
       `)
        
    return rows
}

