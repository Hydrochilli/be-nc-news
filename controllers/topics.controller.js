const {fetchAllTopics} = require('./../models/topics.model');

exports.getAllTopics = async (req, res, next) => {
    
    const topics = await fetchAllTopics()
    .then(topics => {

    
    if(!topics || topics.length === 0) {
        return res.status(404).send({ message: 'No topics found'})
    }
    res.status(200).send({topics})

})
.catch(error => {
    next(error)
})
}