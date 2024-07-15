const db = require('../db/connection')

exports.fetchAllTopics = async () => {
    const {rows} = await db.query('SELECT * FROM topics')
    return rows
}