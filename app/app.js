
const { getTopics, getArticles, getArticleById, getCommentsByArticleId  } = require("./app.controller")
const express = require("express")
const app = express()

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.use((err, request, response, next) => {
    const {status, msg} = err
    response.status(status).send({msg})
})

module.exports = app