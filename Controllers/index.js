const router = require("express").Router()
const apiRoutes = require("./api")
const dashboardRoutes = require("./dashboardRoutes")
const loginRoutes = require("./loginRoutes")

router.use("/api", apiRoutes)
router.use("/login", loginRoutes)
router.use("/dashboard", dashboardRoutes)

module.exports = router