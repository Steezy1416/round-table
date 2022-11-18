const seedUsers = require("./user-seeds")
const seedMessages = require("./message-seeds")
const seedChats = require("./chat-seeds")
const seedUserChats = require("./userChat-seeds")

const sequelize = require("../Config/connection")

const seedAll = async () => {
    await sequelize.sync({force: true})

    await seedUserChats()
    await seedUsers()
    await seedChats()
    await seedMessages()

    process.exit(0)
}

seedAll()