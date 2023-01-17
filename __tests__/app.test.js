const request = require("supertest")
const assert = require("supertest")
const app = require("../app/app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const expectedTopics = require("../db/data/test-data/topics")
const comments = require("../db/data/test-data/comments")
const expectedArticles = require("../db/data/test-data/articles")


beforeEach(() => {
    return seed(data)
})
  
afterAll(() => {
    return db.end()
})

describe("news-api", () => {
    describe("GET requests", () => {
        describe("GET /api/topics", () => {
            test("responds with status code 200 and an object in expected format", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    expect(body).toHaveProperty("topics")
                    const { topics } = body
                    expect(topics instanceof Array).toBe(true)
                    expect(topics.length).toBeGreaterThan(0)
                    topics.forEach((element) => {
                        expect(element instanceof Object).toBe(true)
                    })
                })  
            })
            test("each object in the 'topics' array has the expected keys and value types", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    const { topics } = body
                    expect(topics.length).toBeGreaterThan(0)
                    topics.forEach((topic) => {
                        expect(topic.slug).toEqual(expect.any(String))
                        expect(topic.description).toEqual(expect.any(String))
                    })
                })
            })     
            test("the values for 'slug' and 'description' are retreived from the 'nc_news_test' database", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body}) => {
                    const { topics } = body
                    expect(topics.length).toBeGreaterThan(0)
                    topics.forEach((topic, index) => {
                        expect(topic).toEqual(expectedTopics[index])
                    })
                })
            })       
        })

        describe("GET /api/articles", () => {
            test("responds with status code 200 and an object in expected format", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    expect(body).toHaveProperty("articles")
                    const { articles } = body
                    expect(articles instanceof Array).toBe(true)
                    expect(articles.length).toBeGreaterThan(0)
                    articles.forEach((element) => {
                        expect(element instanceof Object).toBe(true)
                    })
                })
                
            })
            test("each object in the 'articles' array has the expected keys and value types", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    articles.forEach((article) => {
                        expect(article.author).toEqual(expect.any(String))
                        expect(article.title).toEqual(expect.any(String))
                        expect(article.article_id).toEqual(expect.any(Number))
                        expect(article.topic).toEqual(expect.any(String))
                        expect(article.created_at).toEqual(expect.any(String))
                        expect(article.votes).toEqual(expect.any(Number))
                        expect(article.article_img_url).toEqual(expect.any(String))
                        expect(article.comment_count).toEqual(expect.any(String))
                    })
                })
            })  
            test("the value of 'comment_count' is equal the number of comments for a given article", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    articles.forEach((article) => {
                        const expectedCount = comments.filter((comment) => {
                            return comment.article_id == article.article_id
                        }).length
                        expect(article.comment_count).toBe(String(expectedCount))
                    })
                })
            })  
            test("the 'articles' array is returned in descending date order", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles.length).toBeGreaterThan(0)
                    expect(articles).toBeSortedBy("created_at", {descending: true})
                })
            }) 
        })
    })
})