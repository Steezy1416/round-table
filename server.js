const express = require("express")
const sequelize = require("./Config/connection")
const path = require("path")
const exphbs = require("express-handlebars")
const helpers = require("./utils/formater")
const bodyParser = require("body-parser")

const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

const PORT = process.env.PORT || 3001

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
            socket.on("message", ({room, message}) => {
                socket.to(room).emit("receive-message",message)
                
                socket.broadcast.emit("notification", room)
                console.log(`Message is ${message}`)
            })

            socket.on("file-message", ({room, file}) => {
                socket.to(room).emit("receive-file", file)
                console.log("file sent")
            })

            //removes user
            socket.on("left-chat", ({room, user}) => {
                socket.to(room).emit("remove-user", (user))
                console.log(`${user} has left the chat`)
            })
        })
    })
    
})


