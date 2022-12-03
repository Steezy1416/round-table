const {User, Chat, Message} = require("../../Models")
const router = require("express").Router()

//get all messages
router.get("/", (req, res) => {
    Message.findAll({
        attributes: ["id", "text_message", "user_id", "chat_id"],
        include: [
            {
                model: User,
                attributes: ["id", "username"]
            },
            {
                model: Chat,
                attributes: ["id", "chat_name"]
            }
        ]
    })
    .then(messageData => res.json(messageData))
    .catch(err => {
        res.status(500).json(err)
    })
})

//get message by id
router.get("/:id", (req, res) => {
    Message.findOne({
        where: {
            id: req.params.id
        },
        attributes: ["id", "text_message", "user_id", "chat_id"],
        include: [
            {
                model: User,
                attributes: ["id", "username"]
            },
            {
                model: Chat,
                attributes: ["id", "chat_name"]
            }
        ]
    })
    .then(messageData => {
        if(!messageData){
            res.status(404).json({message: "No message found with this id"})
        }
        res.json(messageData)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

//create a new mesage
router.post("/", (req, res) => {
    Message.create({
        text_message: req.body.text_message,
        user_id: req.body.user_id,
        chat_id: req.body.chat_id
    })
    .then(messageData => res.json(messageData))
    .catch(err => {
        res.status(500).json(err)
    })
})

//edit message
router.put("/:id", (req, res) => {
    Message.update({
        text_message: req.body.text_message
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then(messageData => {
        if(!messageData){
            res.status(404).json({message: "No message found with this id"})
        }
        res.json(messageData)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

//delete message
router.delete("/:id", (req, res) => {
    Message.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(messageData => {
        if(!messageData){
            res.status(404).json({message: "No message found with this id"})
        }
        res.json(messageData)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

module.exports = router