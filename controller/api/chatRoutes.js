const { User, Chat, Message, UserChat } = require("../../model")
const router = require("express").Router()

//get all chats
router.get("/", (req, res) => {
    Chat.findAll({
        attributes: ["id", "chat_name"],
        include: [
            {
                model: User,
                attributes: ["id", "username"]
            },
            {
                model: Message,
                attributes: ["id", "text_message", "user_id"]
            }
        ]
    })
        .then(chatData => res.json(chatData))
        .catch(err => {
            res.status(500).json(err)
        })
})

//get chat by id
router.get("/:id", (req, res) => {
    Chat.findAll({
        where: {
            id: req.params.id
        },
        attributes: ["id", "chat_name"],
        include: [
            {
                model: User,
                attributes: ["id", "username"]
            },
            {
                model: Message,
                attributes: ["id", "text_message", "user_id"]
            }
        ]
    })
        .then(chatData => {
            if (!chatData) {
                res.status(404).json({ message: "No chat found with this id" })
            }
            res.json(chatData)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

//create new chat
router.post("/", (req, res) => {
    Chat.create({
        chat_name: req.body.chat_name,
        user_ids: req.body.user_ids
    })
        .then(chat => {
            if (req.body.user_ids.length) {
                const userIdArr = req.body.user_ids.map(user_id => {
                    return {
                        chat_id: chat.id,
                        user_id
                    }
                })
                return UserChat.bulkCreate(userIdArr)
            }
            res.status(200).json(chat)
        })
        .then(userIds => res.json(userIds))
        .catch(err => {
            res.status(500).json(err)
        })
})

// eidt chat users
router.put('/:id', (req, res) => {
    Chat.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((chat) => {
        return UserChat.findAll({ where: { chat_id: req.params.id } });
      })
      .then((chatUsers) => {
        const userIds = chatUsers.map(({ user_id }) => user_id);
        const newChatUsers = req.body.user_ids
          .filter((user_id) => !userIds.includes(user_id))
          .map((user_id) => {
            return {
              chat_id: req.params.id,
              user_id,
            };
          });
        const chatUsersToRemove = chatUsers
          .filter(({ user_id }) => !req.body.user_ids.includes(user_id))
          .map(({ id }) => id);
  
        return Promise.all([
          UserChat.destroy({ where: { id: chatUsersToRemove } }),
          UserChat.bulkCreate(newChatUsers),
        ]);
      })
      .then((updateChatUsers) => res.json(updateChatUsers))
      .catch((err) => {
        res.status(400).json(err);
      });
  });
  

//delete chat
router.delete("/:id", (req, res) => {
    Chat.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(chatData => {
            if (!chatData) {
                res.status(404).json({ message: "No chat found with this id" })
            }
            res.json(chatData)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router