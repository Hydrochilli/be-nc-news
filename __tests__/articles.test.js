const request = require('supertest');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require('../app.js');

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
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }) 
       
        })
})
test('should return a 404 if it is an invalid article-id', async () => {
    await request(app).get('/api/articles/99999').expect(404)
})
test('should return a 400 if ID-request-input is in wrong format e.g a string ', async () => {
    await request(app).get('/api/articles/not-a-number').expect(400)
})

describe('GET /api/articles selectAllArticles', () => {
    test('should return an array of all article objects, in descending order by date', async () => {
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
          expect(body.message).toBe('route is invalid');
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

