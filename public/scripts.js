// public/scripts.js
window.onload = async function () {
    const res = await fetch('/balance');
    const data = await res.json();
  
    if (data.user) {
      document.getElementById('auth').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      document.getElementById('user').innerText = data.user;
      document.getElementById('balance').innerText = data.balance;
    }
  };
  