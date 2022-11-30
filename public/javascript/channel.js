const socket = io("http://localhost:3001")

//joins the room
async function joinRoom() {
    const input = document.querySelector(".message-input")
    input.focus()
    const room = document.querySelector(".info-title").innerText
    const answer = await socket.emit("join-room", room)

    const li = [...document.querySelectorAll(".message")];
    const imagePost = []
    li.forEach(elem => {
        if (elem.innerText.split("(")[0] == "url") {
            const user = elem.closest("li").getElementsByClassName("message-user")[0].innerHTML.split("<")[0]
            imagePost.push({ id: elem.attributes[1].value, text: elem.innerText, user })
        };
    });

    console.log(imagePost)
    convertFile(imagePost)

    if (answer.ok) {
        console.log(room)
        console.log(answer)
    }
}

const convertFile = imagePost => {

    imagePost.forEach((file, index) => {
        const { id, text, user } = imagePost[index]

        const post = document.querySelector(`[data-message_id="${id}"]`)

        let child = post.lastElementChild
        while (child) {
            post.removeChild(child)
            child = post.lastElementChild
        }

        let messageUser = document.createElement("p")
        messageUser.classList.add("message-user")
        messageUser.innerText = `${user}`

        let date = document.createElement("span")
        date.className = "date"
        date.innerText = "90/40/11"

        let displayImage = document.createElement("div")
        displayImage.className = "message display-image"
        displayImage.style.backgroundImage = `${text}`

        messageUser.append(date)
        post.append(messageUser, displayImage)

        async function convertToBlob(text) {
            console.log(text)
            const base64 = await fetch(text)
            const blob = await base64.blob()
            reader.readAsDataURL((blob))
        }

        convertToBlob(text)

    })
}

//displays new message
socket.on("receive-message", message => {
    console.log("message received")
    showMessage(message)
})

//notifies user when they recieve a message
socket.on("notification", room => {
    let interval = 0
    const word = room.split(" ")
    const formatedName = []
    word.forEach(letter => {
        formatedName.push(letter[0])
    });
    const roomTitle = formatedName.filter((letter, index) => index < 2).join('')

    const li = [...document.querySelectorAll(".nav-item")];
    console.log(roomTitle)
    let listElement = ''
    li.forEach(elem => {
        if (elem.innerText == roomTitle) {
            listElement = elem
        };
    });

    const timer = setInterval(() => {
        listElement.classList.add("active")
        interval += 1
        if (interval === 13) {
            clearInterval(timer)
            listElement.classList.remove("active")
        }
    }, 300)
})

//removes user from chat list and user left chat message
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
const showMessage = ({ message, currentUser }) => {

    let messageContainer = document.querySelector(".message-container")

    let listItem = document.createElement("li")
    listItem.classList.add("text_message")

    let messageUser = document.createElement("p")
    messageUser.classList.add("message-user")
    messageUser.innerText = `${currentUser}`

    let date = document.createElement("span")
    date.className = "date"
    date.innerText = "90/40/11"

    let messageParagraph = document.createElement("p")
    messageParagraph.className = "message"
    messageParagraph.innerText = message

    console.log(listItem)
    messageUser.append(date)
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
    const user_id = parseInt(document.querySelector(".navbar").getAttribute("data-session_user_id"))

    const currentUser = document.querySelector(".navbar").getAttribute("data-session_username")

    const message = document.querySelector(".message-input").value.trim()
    const chat_id = parseInt(window.location.toString().split("/")[5])
    const room = document.querySelector(".info-title").innerText

    const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
            text_message: message,
            user_id: user_id,
            chat_id: chat_id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = {
        room,
        message,
        currentUser
    }

    if (response.ok) {
        socket.emit("message", data)
        showMessage(data)
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
            user: user,
        }

        socket.emit("left-chat", data)
        changeChannel(newChatList)
    }
}

const selectFile = (event) => {
    event.preventDefault()
    const input = document.querySelector(".file-input")
    input.click()

}

const fileInput = document.querySelector(".file-input")

fileInput.addEventListener("change", function () {

    const reader = new FileReader()
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result

        const currentUser = document.querySelector(".navbar").getAttribute("data-session_username")

        let messageContainer = document.querySelector(".message-container")

        let listItem = document.createElement("li")
        listItem.classList.add("text_message")

        let messageUser = document.createElement("p")
        messageUser.classList.add("message-user")
        messageUser.innerText = `${currentUser}`

        let date = document.createElement("span")
        date.className = "date"
        date.innerText = "90/40/11"

        let displayImage = document.createElement("div")
        displayImage.className = "message display-image"
        displayImage.style.backgroundImage = `url(${uploaded_image})`

        messageUser.append(date)
        listItem.append(messageUser, displayImage)
        messageContainer.append(listItem)
        postFileMessage(uploaded_image)

    })
    reader.readAsDataURL(this.files[0])
})

async function postFileMessage(uploaded_image) {
    console.log(uploaded_image)
    const message = `url(${uploaded_image})`
    const chat_id = parseInt(window.location.toString().split("/")[5])
    const room = document.querySelector(".info-title").innerText
    const currentUser = document.querySelector(".navbar").getAttribute("data-session_username")
    const user_id = parseInt(document.querySelector(".navbar").getAttribute("data-user_id"))

    const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
            text_message: message,
            user_id: user_id,
            chat_id: chat_id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = {
        room: room,
        file: message,
        currentUser
    }

    if (response.ok) {
        socket.emit("file-message", data)
    }
}

socket.on("receive-file", ({ file, currentUser }) => {
    console.log("Received file")
    showFile(file, currentUser)
})

const showFile = (file, currentUser) => {
    let messageContainer = document.querySelector(".message-container")

    let listItem = document.createElement("li")
    listItem.classList.add("text_message")

    let messageUser = document.createElement("p")
    messageUser.classList.add("message-user")
    messageUser.innerText = `${currentUser}`

    let date = document.createElement("span")
    date.className = "date"
    date.innerText = "90/40/11"

    let displayImage = document.createElement("div")
    displayImage.className = "message display-image"
    displayImage.style.backgroundImage = `${file}`

    messageUser.append(date)
    listItem.append(messageUser, displayImage)
    messageContainer.append(listItem)

    async function convertToBlob(file) {
        console.log(file)
        const base64 = await fetch(file)
        const blob = await base64.blob()
        reader.readAsDataURL((blob))
    }

    convertToBlob(file)
}

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================

const newChat = document.getElementById('new-chat');
const createChat = document.getElementById('create-chat');
const joinChat = document.getElementById('join-chat');
const modalOuter = document.querySelector('.modal-outer');

// newChat opens modal
function handleModalClick() {
    modalOuter.classList.add('open');
  }
  
  // createChat closes modal
  function closeModal() {
    modalOuter.classList.remove('open');
  }
  
  modalOuter.addEventListener('click', (event) => {
    const isOutside = !event.target.closest('.modal-inner');
    if (isOutside) {
      closeModal();
    }
  });
  // when you click on new chat it runs modalHandler
  newChat.addEventListener('click', handleModalClick);
  
  async function createChatHandler(event) {
    event.preventDefault();
  
    const chat_name = document.querySelector('#new-chat-name').value.trim();
    const currentUserId = parseInt(document.querySelector(".navbar").getAttribute("data-user_id"))

    const current_chat_id = parseInt(document.querySelector(".chat-info").getAttribute("data-chat_id"))
  
    // POST request to create a new chat
    const response = await fetch('/api/chats', {
      method: 'POST',
      body: JSON.stringify({
        chat_name: chat_name,
        user_ids: [currentUserId]
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      document.location.replace("/dashboard")
      document.location.replace(`/dashboard/channel/${current_chat_id}`)
    }
    closeModal()
  
  }
  
  // when you click on create chat it runs createChatHandler, which creates a new chat, closes modal, then joins chat
  async function joinChatHandler() {
    const chat_id = parseInt(document.querySelector('#join-chat-name').value.trim());
    const currentUserId = parseInt(document.querySelector(".navbar").getAttribute("data-user_id"))

    const current_chat_id = parseInt(document.querySelector(".chat-info").getAttribute("data-chat_id"))
  
    // PUT request to join a chat by id
    const response = await fetch(`/api/chats/${chat_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        user_ids: [currentUserId]
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
        document.location.replace("/dashboard")
        document.location.replace(`/dashboard/channel/${current_chat_id}`)
    }
    closeModal()
  }
  
  // when you click on create chat it runs createChatHandler
  createChat.addEventListener('click', createChatHandler);
  // when you click on join chat it runs joinChatHandler, and redirects to channel
  joinChat.addEventListener('click', joinChatHandler);



joinRoom()

