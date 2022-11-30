const socket = io('http://localhost:3001');
const newChat = document.getElementById('new-chat');
const createChat = document.getElementById('create-chat');
const joinChat = document.getElementById('join-chat');
const modalOuter = document.querySelector('.modal-outer');

// when you click chat it will get its id and go to channel
async function selectChat(event) {
  const chat_id = event.target.getAttribute('data-chat_num');

  const response = await fetch(`/dashboard/channel/${chat_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    document.location.reload();
    document.location.replace(`/dashboard/channel/${chat_id}`);
  }
}

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

function createChatHandler(event) {
  event.preventDefault();

  const chat_name = document.querySelector('#new-chat-name').value.trim();

  // POST request to create a new chat
  fetch('/api/chats', {
    method: 'POST',
    body: JSON.stringify({ chat_name }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.location.reload();
    });

  closeModal();
}

// when you click on create chat it runs createChatHandler, which creates a new chat, closes modal, then joins chat
function joinChatHandler() {
  const chat_id = document.querySelector('#join-chat-name').value.trim();

  // PUT request to join a chat by id
  fetch(`/api/chats/${chat_id}`, {
    method: 'PUT',
    body: JSON.stringify({ user_ids: [1] }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.location.reload();
    });

  closeModal();
}

// when you click on create chat it runs createChatHandler
createChat.addEventListener('click', createChatHandler);
// when you click on join chat it runs joinChatHandler, and redirects to channel
joinChat.addEventListener('click', joinChatHandler);
