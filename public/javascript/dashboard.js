const socket = io('http://localhost:3001');

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

// when you click on leave chat, it will log you out and go back to login page

async function leaveChat(event) {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/');
  }
}
