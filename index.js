const express = require('express')
const dotenv = require("dotenv/config")
const bodyParser = require("body-parser")

const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const UsersController = require("./user/UsersController")

const Article = require("./articles/Article.model")
const Category = require("./categories/Category.model")
const User = require("./user/User.model")

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
app.use("/", UsersController)

app.get("/", (req, res) => {

    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})
        })

        
    })

})

app.get("/:slug", (req, res) => {

  var slug = req.params.slug;
  Article.findOne({
    where: {
        slug: slug
    }
  }).then(article => {
    if(article != undefined){
        Category.findAll().then(categories => {
            res.render("index", {article: article, categories: categories})
        })
    }else{
        res.redirect("/")
    }
  }).catch( err => {
    res.redirect("/")
  })

})
app.get("/category/:slug", (req, res) => {

    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then((categories => {
                res.render("index", {articles: category.articles, categories: categories})
            }))
        }else{
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })

})


app.listen(process.env.PORT, () => {
    console.log("Servidor iniciado")
})