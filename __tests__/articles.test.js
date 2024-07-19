const request = require('supertest');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require('../app.js');
const userData = require('../db/data/test-data/users.js')
beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET api/articles/:article_id, should return an article by article_id', () => {
    it('returns an object with the correct property key-value pairs- fitting the ID given', async () => {
        const { body } = await request(app).get('/api/articles/2').expect(200)
        const {article} = body;
       
        expect(article).toEqual({
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 0,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: "0"
        }) 
       
        })
})
test('should return a 404 if it is an invalid article-id', async () => {
    await request(app).get('/api/articles/99999').expect(404)
})
test('should return a 400 if ID-request-input is in wrong format e.g a string ', async () => {
    await request(app).get('/api/articles/three').expect(400)
})

describe('GET /api/articles selectAllArticles', () => {
    test('returns an array of all article objects, in descending order by date', async () => {
    const { body } = await request(app).get('/api/articles').expect(200)
    
    expect(body.articles.length).toBe(13)
    expect(body.articles).toBeSortedBy('created_at', { descending: true });
     })
    
    test('should not include body in properties and should have comment_count property', async () => {
       const { body } = await request(app).get('/api/articles').expect(200)
       body.articles.forEach(article => {
        expect(article).not.toHaveProperty('body')
       expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count:expect.any(String),

       })
       
    }) 
    })
    describe('Get request for invalid route', () => {
        test('should return a 404 status for invalid routes', async () => {
          const { body } = 
          await request(app)
          .get('/api/articled')
          .expect(404);
          expect(body.message).toBe('route or query is invalid');
        })
      })
      describe(' getArticleCommentsByID /api/articles/:article_id/comments', () => {
        test('Returns an array of comments on a property of an object , matching valid article_id which has correct properties and sorted by date (descending)', async () => {
          const { body } = await request(app)
          .get('/api/articles/5/comments')
          .expect(200);
         
         const expectedComments =
         [
            {
              article_id: 5,  
              comment_id: 15,
              votes: 1,
              created_at: '2020-11-24T00:08:00.000Z',
              author: 'butter_bridge',
              body: "I am 100% sure that we're not completely sure."
            },
          
            {
              article_id: 5,
              comment_id: 14,
              votes: 16,
              created_at: '2020-06-09T05:00:00.000Z',
              author: 'icellusedkars',
              body: 'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.'
            }
         ]
          expect(body.comments).toEqual(expectedComments)
          
          
          expect(body.comments).toBeSortedBy('created_at', { descending: true });
        })

 })
 test('should return a 404 if it is an invalid article-id', async () => {
    await request(app)
    .get('/api/articles/99999/comments')
    .expect(404)
})
test('should return a 400 if ID-input is in wrong format e.g a string ', async () => {
    await request(app)
    .get('/api/articles/not-a-number/comments')
    .expect(400)
  
})

test('should return a 200 status and a message and an empty array when there is no comments for an article', async () => {
    const {body} = await request(app)
    .get('/api/articles/7/comments')
    .expect(200)
    expect(body.message).toBe('No comments found for article_id')
   
 })
})
 describe('POST /api/articles/:article_id/comments', () => {
  test('returns 201 and posts a request to an article and sends back a copy of the posted message', async () => {
    const { body } = await request(app)
      .post('/api/articles/3/comments')
      .send({ username: 'rogersop', body: 'This article is a bit far fetched' })
      .expect(201);
     expect(body.comment).toMatchObject({
        comment_id: 19,
        body: 'This article is a bit far fetched',
        article_id: 3,
        author: 'rogersop',
        votes: 0,
        created_at: expect.any(String),
      })

    
  })
 describe('Handles a range of possible errors correctly for the situation - 404 - 400 -etc', () => {
  test('returns a 404 if username does not exist with "user does not exist" message', async () => {
    const { body } = await request(app)
     .post('/api/articles/1/comments')
     .send({ username: 'delta', body: 'This article is a bit far fetched'})
     .expect(404)
     expect(body.message).toBe('user does not exist')
  })
  test('returns a 404 with "No article with that ID" message', async () => {
    const {body} = await request(app)
     .post('/api/articles/55255/comments')
     .send({username:'rogersop', body: 'This article is a bit far fetched' })
     .expect(404)
     expect(body.message).toBe('No article with that ID')
    })
    test('returns a 400 if article_id is not a number with informative message', async () =>  {
      const {body} = await request(app)
      .post('/api/articles/not-a-number/comments')
      .send({username:'rogersop', body: 'This article is a bit far fetched' })
      .expect(400)
      expect(body.message).toBe('Input must be a number')

    })
    test('returns 400 if request body missing required properties, with message ', async () => {
      const {body} = await request(app)
      .post('/api/articles/5/comments')
      .send({username: 'rogersop'})
      .expect(400)
      expect(body.message).toBe('request body invalid')
    })
  })
  describe('PATCH /api/articles/:article_id', () =>{
    test('updates the votes of an article and returns the updated article', async () => {
      const {body} = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1})
      .expect(200)
      const { article } = body;
      expect(article).toMatchObject({ article_id: 1, votes: 101})
      
    })
    test('returns a 404 if the article_id does not exist', async () => {
      const {body} = await request(app)
      .patch('/api/articles/55255')
      .send({ inc_votes: 1 })
      .expect(404)
    expect(body.message).toBe('No article with that ID')
    })
    test('returns a 400 if the article_id is not a number', async () => {
      const {body} = await request(app)
      .patch('/api/articles/NaN')
      .send({ inc_votes: 1})
      .expect(400)
    expect(body.message).toBe('Input must be a number')
    })
    test('returns a 400 if the inc_votes key is missing from request', async () => {     
       const {body} = await request(app)
       .patch('/api/articles/3')
       .send({})
       .expect(400)
      expect(body.message).toBe('invalid request body')      
      
    })
    test('returns a 400 when inc_votes is not a number', async () => {
      const {body} = await request(app)
      .patch('/api/articles/3')
      .send({inc_votes: 'three'})
      .expect(400)
    expect(body.message).toBe('invalid request body')
    })
})
describe('DELETE /api/comments/:comment_id', () => {
  test('deletes the selected comment_id and return 204', async () => {
    await request(app)
    .delete('/api/comments/1')
    .expect(204)
  })
  test('return 404 if comment_id does not exist', async () => {
     const {body} = await request(app)
     .delete('/api/comments/5555555')
     .expect(404)
    expect(body.message).toBe('No comment with that ID')
  })
  test('returns 400 if the comment_id is not a number', async () => {
    const {body} = await request(app)
    .delete('/api/comments/A1')
    .expect(400)
  expect(body.message).toBe('Input must be a number')
  })
})
describe('GET /api/users selectAllUsers', () => {
  test('returns 200 and responds with an array of all users.', async () => {
  const { body } = await request(app)
  .get('/api/users')
  .expect(200)
  
  expect(body.users.length).toBe(4)

  
   })
   test('each of the array objects contains the keys; username, name, avatar_url ', async () => {
    const {body} = await request(app)
    .get('/api/users')
    .expect(200)
    const {users } = body
    expect(users[0]).toMatchObject(  {
      username: 'butter_bridge',
      name: 'jonny',
      avatar_url:
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
    })
  users.forEach((user, i) => {
    expect(user).toMatchObject(userData[i])
    })
    })

  describe('GET /api/articles, with added sort_by and order query functionality', () => {
    test('returns array of all articles sorted by created_at in descending order by default', async () => {
       const {body} = await request(app)
       .get('/api/articles')
       .expect(200)
      expect(body.articles).toBeSortedBy('created_at', {descending: true})
    })
    test('sorts articles by a valid column when given sort_by query', async () => {
      const {body} = await request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
     expect(body.articles).toBeSortedBy('title', { descending: true})
    })
    test('returns articles by created_at  in ascending order when provided with this query', async () =>{
      const {body} = await request(app)
      .get('/api/articles?order=asc')
      .expect(200)
    expect(body.articles).toBeSortedBy('created_at', {descending: false})
    })
    test('sorts and orders articles correctly when both sort_by and order used together', async() => {
      const {body} = await request(app)
      .get('/api/articles?sort_by=title&order=asc')
      .expect(200)
    expect(body.articles).toBeSortedBy('title', {descending: false})
    })
    test('returns articles of a single topic when requested in the query', async () => {
      const {body} = await request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      body.articles.forEach(article => {
        expect(article.topic).toBe('mitch')
      })
    })
    test('returns 400 for invalid sort_by query', async () => {
      const {body} = await request(app)
      .get('/api/articles?sort_by=date')
      .expect(400)
    expect(body.message).toBe('Invalid query request')
    })
    test('return 400 for invalid order query', async () => {
      const {body} = await request(app)
      .get('/api/articles?order=sideways')
      .expect(400)
    expect(body.message).toBe('Invalid query request')
    })
    test('returns 404 for topic that does not exist', async () => {
      const {body} = await request(app)
      .get('/api/article?topic=dogs')
      .expect(404)
    expect(body.message).toBe('route or query is invalid')
    })
  
 
  })
  
    })
   })
  
 

