const {fetchAllTopics} = require('./../models/topics.model');

exports.getAllTopics = async (req, res, next) => {
    
    const topics = await fetchAllTopics()
   

    res.status(200).send({topics})
}
