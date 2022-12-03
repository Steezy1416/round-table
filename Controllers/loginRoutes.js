const {User} = require("../Models")
const router = require("express").Router()

router.get("/", (req, res) => {
    res.render("login")
})

router.post("/users", (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    })
    .then(userData => {
        if(!userData.username){
            res.status(404).json({message: "user not found"})
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