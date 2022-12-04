const {User} = require("../models")

const userData = [
{
    username: "Spiderman",
    password: "notPeterParker"
},
{
    username: "Batman",
    password: "notBruceWayne"
},
{
    username: "Iron Man",
    password: "notTonyStark"
},
{
    username: "Superman",
    password: "notClarkKent"
},
{
    username: "Flash",
    password: "mrSpeed"
},
{
    username: "Thor",
    password: "sonOfOdin"
},
{
    username: "NoobMaster64",
    password: "noob"
},
{
    username: "Sir Williamus the Utterback",
    password: "willson"
},
{
    username: "Sir Slavic",
    password: "1234"
},
]

const seedUsers = () => User.bulkCreate(userData)

module.exports = seedUsers