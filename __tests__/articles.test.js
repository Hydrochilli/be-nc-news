const request = require('supertest');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require('../app.js');

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('should return an article by article_id', () => {
    it('returns an object with the correct property key: value pairs- fitting the ID given', async () => {
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
        expect(article).toHaveProperty('article_id' ),
        expect(article).toHaveProperty('title', 'Sony Vaio; or, The Laptop')
        })
})
test('should return a 404 if it is an invalid article-id', async () => {
    await request(app).get('/api/articles/99999').expect(404)
})
test('should return a 400 if ID-request-input is in wrong format e.g a string ', async () => {
    await request(app).get('/api/articles/not-a-number').expect(400)
})
