const endpoints = require('../endpoints.json')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const app = require('../app')


beforeEach(() => seed(testData))
afterAll(() => db.end())

describe( 'testing get request for available endpoints and that it responds with endpoints.json file', () => {
    test('shoud return all endpoints listed in a JSON object', async () => {
        const {body} = await request(app).get('/api').expect(200)
        expect(body).toEqual({endpoints})
    })
})

