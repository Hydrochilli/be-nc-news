const db = require('../db/connection')

exports.fetchAllTopics = async () => {

    const {rows} = await db.query('SELECT * FROM topics')
    if(rows.length === 0) {
        return Promise.reject({status: 404, message: 'No topics found'
        })
    }
    return rows

}
