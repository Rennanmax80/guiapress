const express = require('express')
const dotenv = require("dotenv/config")
const bodyParser = require("body-parser")

const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

const Article = require("./articles/Article.model")
const Category = require("./categories/Category.model")

const app = express()

app.set('view engine', 'ejs')


app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso")
}).catch((error) => {
    console.log(error)
})

app.use("/", categoriesController)
app.use("/", articlesController)

app.get("/", (req, res) => {
    res.render("index")
})


app.listen(process.env.PORT, () => {
    console.log("Servidor iniciado")
})