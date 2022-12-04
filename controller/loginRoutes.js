const {User} = require("../model")
const router = require("express").Router()

router.get("/", (req, res) => {
    res.render("login")
})

router.post("/", (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    })
    .then(userData => {
        console.log(userData)
        if(!userData){
            res.status(404).json({mesage: "User not found, please try again"})
            return
        }

        req.session.save(() => {
            req.session.user_id = userData.id
            req.session.username = userData.username
            req.session.loggedIn = true

            res.json(userData)
        })
    })
})

module.exports = router