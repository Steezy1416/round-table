//when you click chat it will get its id and go to channel
async function selectChat(event){
    const chat_id = event.target.getAttribute("data-chat_num")

    const response = await fetch(`/dashboard/channel/${chat_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if(response.ok){
        document.location.replace(`/dashboard`)
        document.location.reload()
        document.location.replace(`/dashboard/channel/${chat_id}`)
    }
}