const {UserChat} = require("../models")

const userChatsData = [
    {
        user_id: "1",
        chat_id: "1"
    },
    {
        user_id: "1",
        chat_id: "2"
    },
    {
        user_id: "2",
        chat_id: "2"
    },
    {
        user_id: "3",
        chat_id: "1"
    },
    {
        user_id: "4",
        chat_id: "2"
    },
    {
        user_id: "5",
        chat_id: "2"
    },
    {
        user_id: "6",
        chat_id: "1"
    },
    {
        user_id: "7",
        chat_id: "3"
    },
    {
        user_id: "8",
        chat_id: "3"
    },
    {
        user_id: "9",
        chat_id: "3"
    },
]

const seedUserChats = () => UserChat.bulkCreate(userChatsData)

module.exports = seedUserChats