const {Message} = require("../model")

const messageData = [
    {
        text_message: "Have yall seen hulk?",
        user_id: "3",
        chat_id: "1"
    },
    {
        text_message: "Nope, by the way Mr.Stark can i go see Mary Jane?",
        user_id: "1",
        chat_id: "1"
    },
    {
        text_message: "Let the boy have his fun",
        user_id: "6",
        chat_id: "1"
    },
    {
        text_message: "No",
        user_id: "3",
        chat_id: "1"
    },
    {
        text_message: "Hey batman",
        user_id: "4",
        chat_id: "2"
    },
    {
        text_message: "What",
        user_id: "2",
        chat_id: "2"
    },
    {
        text_message: "I think he wants to ask you if you want to come to sapce later",
        user_id: "5",
        chat_id: "2"
    },
    {
        text_message: "No",
        user_id: "4",
        chat_id: "2"
    },
    {
        text_message: "Teams 2 project is looking great",
        user_id: "8",
        chat_id: "3"
    },
    {
        text_message: "I agree",
        user_id: "9",
        chat_id: "3"
    },
    {
        text_message: "I concur",
        user_id: "7",
        chat_id: "3"
    },
]

const seedMessages = () => Message.bulkCreate(messageData)

module.exports = seedMessages