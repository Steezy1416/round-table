//lets you select different chats inside of the channels page
async function selectChat(event) {
    //gets chat id from the data attribute
    const chat_id = event.target.getAttribute("data-chat_num")

    //goes to different channel with that id as the param
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

//post text message
async function postTextMessage(event) {
    event.preventDefault()
    const message = document.querySelector(".message-input").value.trim()
    const chat_id = parseInt(window.location.toString().split("/")[5])
    console.log(message)

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

    if (response.ok) {
        document.location.reload()
    }
}

//remove user from chat
async function leaveChat() {

    const chat_id = document.querySelector(".chat-info").getAttribute("data-chat_id")

    const user_id = parseInt(document.querySelector(".navbar").getAttribute("data-user_id"))


    ///
    ///Gets a list of the user ids and put them inside an array
    const userArr = Array.from(document.querySelectorAll('[data-users-ids]'));

    const usersList = []

    //for each user get its id value 
    userArr.forEach(user => {
        usersList.push(parseInt(user.attributes[1].value))
    })

    //filter out the logged in user from the user list arr
    const newUserList = usersList.filter(users => users != user_id)
    ///


    ///
    ///gets a list of the chat ids
    const chatArr = Array.from(document.querySelectorAll('[data-chat_num]'));

    const chatList = []

    //for each chat get its id value
    chatArr.forEach(chat => {
        chatList.push(chat.attributes[1].value)
    })

    //filter out chat that the user will leave
    const newChatList = chatList.filter(chats => chats != chat_id)
    ///


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
        //when user leaves chat, goes to dashboard to get the new chat values
        document.location.replace("/dashboard")
        document.location.reload()
        //goes back to the channels and selects the first channel that the user is in
        
        //if there is no chats it will take user back to dashboard
        if(newChatList[0] === undefined){
            document.location.replace("/dashboard")
        }
        else {
            document.location.replace(`/dashboard/channel/${newChatList[0]}`)
        }

    }


}