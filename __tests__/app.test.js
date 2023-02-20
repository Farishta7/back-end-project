const request = require("supertest");
const app = require("../app.js");
const index = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");
const connection = require("../db/connection");
beforeEach(() => {
    return seed(index);
});
afterAll(() => {
    return connection.end();
})

describe('app', () => {
    describe.only('/api/topics', () => {
        test('GET request. 200 status code. Responds with an array of topic objects, with properties of "slug" and "description"', () => {
            return request(app) // Arrange
            .get("/api/topics") // Act
            .expect(200) // Supertest assertion
            .then(({body}) => {
                expect(body.topics).toBeInstanceOf(Array); // this checks that we are receiving back an array as a key
                // The test below checks that we'll get an array back with THE CORRECT objects as specified:
                body.topics.forEach((topic) => {
                   expect(topic).toEqual(
                    expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                   })
                   )
                });
            })
        });
    });
});