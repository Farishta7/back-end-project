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
    describe('/api/topics', () => {
        test('GET request. 200 status code. Responds with an array of topic objects, with properties of "slug" and "description"', () => {
            return request(app) // Arrange
            .get("/api/topics") // Act
            .expect(200) // Supertest assertion
            .then(({body}) => {
                // this checks that we are receiving back an array as a key
                expect(body.topics).toBeInstanceOf(Array);
                // the following tests that the incoming key of an array definitely has something in it:
                expect(body.topics.length).toBeGreaterThan(0); 
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

    describe('/api/articles', () => {
        test('GET request. 200 status code. Responds with an array of article objects with 8 keys in descending order.', () => {
            return request(app) // Arrange
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeInstanceOf(Array);
                expect(body.articles.length).toBeGreaterThan(0);

                body.articles.forEach((article) => {
                    expect(article).toEqual(
                     expect.objectContaining({
                     author: expect.any(String),
                     title: expect.any(String),
                     article_id: expect.any(Number),
                     topic: expect.any(String),
                     created_at: expect.any(String),
                     votes: expect.any(Number),
                     article_img_url: expect.any(String),
                     comment_count: expect.any(Number),
                    })
                    )
                 });

                 const articlesCopy = [...body.articles];
                 const sortedArticles = articlesCopy.sort((articleA, articleB) => {
                    return articleB.date - articleA.date;
                 })

                 expect(sortedArticles).toEqual(body.articles);
            })
        });

    });

    describe('/api/articles/:article_id', () => {
        test('GET request. 200 status code. responds with a single article object.', () => {
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    author: 'butter_bridge',
                     title: 'Living in the shadow of a great man',
                     article_id: 1,
                     body: 'I find this existence challenging',
                     topic: 'mitch',
                     created_at: expect.any(String),
                     votes: 100,
                     article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
        });

        test('GET request. 404 status code. Responds with "Article id not found." when given valid "article_id" (i.e. a number) in the API path that does not exist', () => {
            return request(app)
            .get("/api/articles/5870")
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Article id not found.');
            })
        });

        test('Get request. 400 status code. Responds with "Bad request made." when given INVALID "article_id" (i.e. NOT a number) in the API path that does not exist ', () => {
            return request(app)
            .get("/api/articles/monkey")
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Bad request made.")
            })
        });
    });

    describe('/api/articles/:article_id/comments', () => {
        test('GET request. 200 status code. Should respond with an array of comments for the given article_id of which each comment should have the correct properties. Comments should also be served with the most recent comments first', () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({body}) => {
                body.articleComments.forEach((comment) => {
                    expect(comment).toEqual(
                     expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
                    )
                 });

                expect(body.articleComments).toBeInstanceOf(Array);
                expect(body.articleComments.length).toBeGreaterThan(0); 

                const commentsCopy = [...body.articleComments];
                 const sortedComments = commentsCopy.sort((articleA, articleB) => {
                    return articleA.date - articleB.date;
                 })

                 expect(sortedComments).toEqual(body.articleComments);
            });
        });

        test('GET request. 200 status code. Should respond with an empty array if the article does not have any comments associated with it.', () => {
            return request(app)
            .get("/api/articles/8/comments") // wrote 8 because in the test data, for "article_id 8" in articles.js file, there are no comments in the comments.js file.
            .expect(200)
            .then(({body}) => {
                expect(body.articleComments).toEqual([])
            })
        });

        test('GET request. 404 status code. Responds with "Article id not found." when given valid "article_id" (i.e. a number) in the API path that does not currently exist.', () => {
            return request(app)
            .get("/api/articles/5870/comments")
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe('Article id not found.');
            })
        });

        test('Get request. 400 status code. Responds with "Bad request made." when given INVALID "article_id" (i.e. NOT a number) in the API path that does not exist.', () => {
            return request(app)
            .get("/api/articles/chipmunk/comments")
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Bad request made.")
            })
        });
    });

    describe('POST request: /api/articles/:article_id/comments', () => {
        test('POST request. 201 status code. Request body should accept an object with properties of "username" and "body. And responds with the posted comment.', () => {
            const requestBody = {
                username: "butter_bridge",
                body:"I love butter on toast!"
            };

            return request(app)
            .post("/api/articles/1/comments")
            .send(requestBody) //this is sent to api as a request
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toEqual({
                    comment_id: expect.any(Number),
                    body: "I love butter on toast!",
                    votes: 0,
                    author: "butter_bridge",
                    article_id: 1,
                    created_at: expect.any(String)
                })
            })
        });

        test('POST request. 400 status code. Responds with "Bad request made." when given empty body i.e. {}.', () => {
            const requestBody = {};

            return request(app)
            .post("/api/articles/1/comments")
            .send(requestBody)
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Bad request made. Missing required fields.")
            })
        });

        test('POST request. 400 status code. Responds with "Bad request made." when given INVALID "article_id" (i.e. NOT a number) in the API path that does not exist.', () => {
            const requestBody = {
                username: "butter_bridge",
                body:"I love butter on toast!"
            };

            return request(app)
            .post("/api/articles/dentist/comments")
            .send(requestBody)
            .expect(400)
            .then(({body}) => {
                expect(body.message).toBe("Bad request made.")
            })
        });

        test('POST request. 404 status code. Should respond with "Bad request made." when given an invalid username i.e. username does not exist.', () => {
            const requestBody = {
                username: "tomato",
                body:"I love butter on toast!"
            };

            return request(app)
            .post("/api/articles/1/comments")
            .send(requestBody)
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("Bad request made. Username does not exist.")
            })
            
        });

        test('POST request. 404 status code. Responds with "Article id not found." when given valid "article_id" (i.e. a number) in the API path that does not currently exist.', () => {
            const requestBody = {
                username: "butter_bridge",
                body:"I love butter on toast!"
            };

            return request(app)
            .post("/api/articles/989/comments")
            .send(requestBody)
            .expect(404)
            .then(({body}) => {
                expect(body.message).toBe("Article id not found.")
            })
        });
    });
});