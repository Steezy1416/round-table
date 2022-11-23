const { Model } = require("sequelize")
const sequelize = require("../Config/connection")
const router = require("express").Router()
const {User, Message, Chat, UserChat} = require("../Models")

router.get("/", (req,res) => {
    User.findAll({
        where: {
            id: 1
        },
        attributes: ["id", "username", "password"],
        include: [
            {
                model: Chat,
                attributes: ["id", "chat_name"],
                include: [
                    {
                        model: User,
                        attributes: ["id", "username"]
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
            }
        ]
    })
    .then(userData => {
        const data = userData.map(user => user.get({plain: true}))

        console.log(data[0])

        res.render("dashboard", data[0])
    })
})

module.exports = router