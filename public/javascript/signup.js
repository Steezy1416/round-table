async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-signup').value.trim();
  // password validation pw-set and pw-confirm must match
  const password = document.querySelector('#pw-set').value.trim();
  const passwordConfirm = document.querySelector('#pw-confirm').value.trim();

  // CHECK TO SEE IF PASSWORDS MATCH
  if (password !== passwordConfirm) {
    alert('Passwords do not match');
    return;
  }

  // if a username is already taken, alert the user

  if (username && password === passwordConfirm) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      console.log('success');

      // redirect to dashboard
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
}

document
  .querySelector('#signup-form')
  .addEventListener('submit', signupFormHandler);
