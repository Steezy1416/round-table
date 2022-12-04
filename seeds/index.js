const seedUsers = require("./user-seeds")
const seedMessages = require("./message-seeds")
const seedChats = require("./chat-seeds")
const seedUserChats = require("./userChat-seeds")

const sequelize = require("../config/connection")

const seedAll = async () => {
    await sequelize.sync({force: true})
    console.log("\n-----------DATABASE SYNCED__________________")
    await seedUsers()
    console.log("\n-----------USERS SEEDED__________________")
    await seedChats()
    console.log("\n-----------CHATS SEEDED__________________")
    await seedMessages()
    console.log("\n-----------MESSAGES SEEDED__________________")
    await seedUserChats()
    console.log("\n-----------USERS CHATS SEEDED__________________")

    process.exit(0)
}

seedAll()
.then(data => {
    console.log(data)
})