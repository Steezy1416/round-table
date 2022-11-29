const { Model } = require("sequelize")
const sequelize = require("../Config/connection")
const router = require("express").Router()
const {User, Message, Chat, UserChat} = require("../Models")

let globalUserData = ''

router.get("/", (req,res) => {

    console.log(req.session)

    User.findAll({
        where: {
            id : req.session.user_id
        },
        attributes: ["id", "username", "password"],
        include: [
            {
                model: Chat,
                attributes: ["id", "chat_name"]
            },
            {
                model: Message,
                attributes: ["id", "text_message"]
            }
        ]
    })
    .then(userData => {
        const data = userData.map(user => user.get({plain: true}))

        //saves data into global variable to use in chat call
        globalUserData = data
        res.render("dashboard", data[0])
    })
})

router.get("/channel/:id", (req, res) => {
    Chat.findAll({
        where: {
            id: req.params.id
        },
        attributes: ["id", "chat_name"],
        include: [
            {
                model: User,
                attributes: ["id", "username"],
            },
            {
                model: Message,
                attributes: ["id", "text_message", "user_id"],
                include: [
                    {
                        model: User,
                        attributes: ["id", "username"]
                    }
                ]
            }

        ]
    })
    .then(chatData => {
        const data = chatData.map(chat => chat.get({plain: true}))
    
        res.render("channel", {
            data: data[0],
            globalUserData: globalUserData[0],
            session: sessionInfo = {
                sessionId: req.session.user_id,
                username: req.session.username
            }
        })
    })
})

module.exports = router

