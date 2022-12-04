const {Chat} = require("../models")

const chatData = [
    {
        chat_name: "Avengers"
    },
    {
        chat_name: "Justice League"
    },
    {
        chat_name: "Team 2 fan club"
    },
]

const seedChats = () => Chat.bulkCreate(chatData)

module.exports = seedChats