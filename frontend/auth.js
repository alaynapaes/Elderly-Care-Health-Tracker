// LOGIN
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput
      })
    })
    .then(res => res.json())
  .then(data => {
  if (data.message === 'Login successful') {

    localStorage.setItem('user_id', data.user_id);

    window.location.href = 'patients.html';

  } else {
    alert('Login failed');
  }
});

  });
}

// SIGNUP
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('name').value;
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput,
        email: emailInput,
        password: passwordInput
      })
    })
    .then(res => res.text())
    .then(data => {
      alert('Signup successful!');
      window.location.href = 'login.html';
    });
  });
}
