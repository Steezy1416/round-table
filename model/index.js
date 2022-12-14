const User = require("./User")
const Message = require("./Message")
const Chat = require("./Chat")
const UserChat = require("./UserChat")

User.hasMany(Message, {
    foreignKey: "user_id"
})

Message.belongsTo(User, {
    foreignKey: "user_id"
})

Chat.hasMany(Message, {
    foreignKey: "chat_id"
})

Message.belongsTo(Chat, {
    foreignKey: "chat_id"
})

User.belongsToMany(Chat, {
    through: UserChat,
    foreignKey: "user_id"
})

Chat.belongsToMany(User, {
    through: UserChat,
    foreignKey: "chat_id"
})

module.exports = {
    User,
    Message,
    Chat,
    UserChat
}