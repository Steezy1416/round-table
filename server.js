const express = require("express")
const sequelize = require("./Config/connection")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: false}))

sequelize.sync({force: false})
.then(() => {
    app.listen(PORT, () => console.log("Server is now online"))
})
