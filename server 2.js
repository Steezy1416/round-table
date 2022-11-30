const express = require("express")
const sequelize = require("./Config/connection")
const path = require("path")
const exphbs = require("express-handlebars")
const helpers = require("./utils/formater")
const bodyParser = require("body-parser")
const session = require("express-session")

const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

const PORT = process.env.PORT || 3001

const SequelizeStore = require("connect-session-sequelize")(session.Store)

const sess = {
    secret: "The Amazing Spiderman is underated",
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize
    })
}

app.use(session(sess))

const hbs = exphbs.create({helpers})
app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// app.use(express.json())
// app.use(express.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, "public")))

app.use(require("./Controllers/index"))

sequelize.sync({force: false})
.then(() => {
    server.listen(PORT, () => {

        console.log("Server is now online")

        io.on("connection", (socket) => {
            console.log("User has connected to app")
            console.log(socket.id)
    
            //joins room
            socket.on("join-room", room => {
                socket.join(room)
                console.log(`User joined room ${room}`)
            })
    
            //sends message
            socket.on("message", (data) => {
                socket.to(data.room).emit("receive-message",data)
                
                socket.broadcast.emit("notification", data.room)
                console.log(`Message is ${data.message}`)
            })

            socket.on("file-message", (data) => {
                socket.to(data.room).emit("receive-file", data)
                console.log("file sent")
            })

            //removes user
            socket.on("left-chat", (data) => {
                socket.to(data.room).emit("remove-user", (data.user))
                console.log(`${data.user} has left the chat`)
            })
        })
    })
    
})


