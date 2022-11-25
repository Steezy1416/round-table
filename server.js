const express = require("express")
const sequelize = require("./Config/connection")
const path = require("path")
const exphbs = require("express-handlebars")

const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

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
    server.listen(PORT, () => console.log("Server is now online"))

    io.on("connection", (socket) => {
        console.log("User has connected to app")
        console.log(socket.id)

        socket.on("message", message => {
            socket.broadcast.emit("receive-message", message)
        })
    })
})


