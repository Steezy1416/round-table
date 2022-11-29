//if user has account this switches to log in form
const toLogIn = () => {
    document.querySelector(".signup").classList.remove("hide")
    document.querySelector(".login").classList.add("hide")
}
// if user does not have account this switches to sign up form
const toSignUp = () => {
    document.querySelector(".login").classList.remove("hide")
    document.querySelector(".signup").classList.add("hide")
}