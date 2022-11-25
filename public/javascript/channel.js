const socket = io("http://localhost:3001")

//joins the room
async function joinRoom() {
    const input = document.querySelector(".message-input")
    console.log(input)
    input.focus()
    const room = document.querySelector(".info-title").innerText
    const answer = await socket.emit("join-room", room)

    if (answer.ok) {
        console.log(room)
        console.log(answer)
    }
}

socket.on("receive-message", message => {
    console.log("message received")
    showMessage(message)
})

socket.on("remove-user", user => {
    userLeftMessage(user)
    removeUserFromList(user)
})

//removes user from user list when they leave the chat
const removeUserFromList = user => {
    const li = [...document.querySelectorAll(".user")];
    li.forEach(elem => {
        if (elem.innerText == user) elem.parentNode.removeChild(elem);
    });
}

//lets you select different chats inside of the channels page
async function selectChat(event) {
    const chat_id = event.target.getAttribute("data-chat_num")

    const response = await fetch(`/dashboard/channel/${chat_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.ok) {
        document.location.replace(`/dashboard/channel/${chat_id}`)
    }
}

//displays message on screen
const showMessage = message => {
    let messageContainer = document.querySelector(".message-container")

    let listItem = document.createElement("li")
    listItem.classList.add("text_message")

    let messageUser = document.createElement("p")
    messageUser.classList.add("message-user")
    messageUser.innerText = "Spiderman"

    let messageParagraph = document.createElement("p")
    messageParagraph.className = "message"
    messageParagraph.innerText = message

    console.log(listItem)
    listItem.append(messageUser, messageParagraph)
    console.log(listItem)
    messageContainer.append(listItem)
}

//displays text when user leaves chat
const userLeftMessage = user => {
    let messageContainer = document.querySelector(".message-container")

    let listItem = document.createElement("li")
    listItem.classList.add("text_message")

    let messageParagraph = document.createElement("p")
    messageParagraph.className = "message"
    messageParagraph.innerText = `${user} has left the chat...`

    listItem.append(messageParagraph)
    messageContainer.append(listItem)
}

//post text message to database
async function postTextMessage(event) {
    event.preventDefault()
    const message = document.querySelector(".message-input").value.trim()
    const chat_id = parseInt(window.location.toString().split("/")[5])
    const room = document.querySelector(".info-title").innerText

    const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
            text_message: message,
            user_id: 1,
            chat_id: chat_id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = {
        room,
        message
    }

    if (response.ok) {
        socket.emit("message", data)
        showMessage(message)
        document.querySelector(".message-input").value = ''
    }
}

//changes channels when you leave a chat
const changeChannel = newChatList => {
    document.location.replace("/dashboard")
    document.location.reload()

    //if there is no chats it will take user back to dashboard
    if (newChatList[0] === undefined) {
        document.location.replace("/dashboard")
    }
    else {
        document.location.replace(`/dashboard/channel/${newChatList[0]}`)
    }
}

//remove user from chat form databse
async function leaveChat() {

    const chat_id = document.querySelector(".chat-info").getAttribute("data-chat_id")
    const user_id = parseInt(document.querySelector(".navbar").getAttribute("data-user_id"))

    const userArr = Array.from(document.querySelectorAll('[data-users-ids]'));
    const usersList = []
    userArr.forEach(user => {
        usersList.push(parseInt(user.attributes[1].value))
    })
    const newUserList = usersList.filter(users => users != user_id)


    const chatArr = Array.from(document.querySelectorAll('[data-chat_num]'));
    const chatList = []
    chatArr.forEach(chat => {
        chatList.push(chat.attributes[1].value)
    })
    const newChatList = chatList.filter(chats => chats != chat_id)


    const response = await fetch(`/api/chats/${chat_id}`, {
        method: "PUT",
        body: JSON.stringify({
            user_ids: newUserList
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (response.ok) {

        const room = document.querySelector(".info-title").innerText
        const user = document.querySelector(".navbar").getAttribute("data-user_name")

        const data = {
            room: room,
            user: user
        }

        socket.emit("left-chat", data)
        changeChannel(newChatList)
    }
}
joinRoom()

