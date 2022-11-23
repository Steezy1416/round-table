const express = require("express")
const sequelize = require("./Config/connection")
const path = require("path")
const exphbs = require("express-handlebars")

const app = express()
const PORT = process.env.PORT || 3001

const hbs = exphbs.create({})
app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, "public")))

app.use(require("./Controllers/index"))

sequelize.sync({force: false})
.then(() => {
    app.listen(PORT, () => console.log("Server is now online"))
})
