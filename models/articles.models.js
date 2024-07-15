const db = require('../db/connection')

exports.selectArticleByID = async(article_id) => {
const {rows} = await db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
if(rows.length === 0) {
    return Promise.reject({status: 404, message: 'No article with that ID'
    
    })
}

return rows[0] 

}
