
document.getElementById('account-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const account = { username, password };
        localStorage.setItem(username, JSON.stringify(account));
        displayAccounts();
    }
});


function displayAccounts() {
    const accountsList = document.getElementById('accounts-list');
    accountsList.innerHTML = '';

    Object.keys(localStorage).forEach(function(key) {
        const account = JSON.parse(localStorage.getItem(key));
        const accountDiv = document.createElement('div');
        accountDiv.className = 'account';
        accountDiv.innerHTML = `Username: ${account.username}, Password: ${account.password} <button class="delete-button" onclick="deleteAccount('${account.username}')">Delete</button>`;
        accountsList.appendChild(accountDiv);
    });
}

function deleteAccount(username) {
    localStorage.removeItem(username);
    displayAccounts();
}

document.getElementById('password').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const passwordStrength = document.getElementById('password-strength');

    const strength = checkPasswordStrength(password);
    passwordStrength.textContent = `Password Strength: ${strength}`;
});


function checkPasswordStrength(password) {
    let strength = 'Weak';
    if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'Strong';
    } else if (password.length > 5 && /[A-Z]/.test(password)) {
        strength = 'Medium';
    }
    return strength;
}


document.getElementById('export-json').addEventListener('click', function() {
    const accounts = [];
    Object.keys(localStorage).forEach(function(key) {
        accounts.push(JSON.parse(localStorage.getItem(key)));
    });
    const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounts.json';
    a.click();
});


document.getElementById('import-json').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const accounts = JSON.parse(e.target.result);
            accounts.forEach(account => {
                localStorage.setItem(account.username, JSON.stringify(account));
            });
            displayAccounts();
        };
        reader.readAsText(file);
    }
});


document.getElementById('toggle-accounts').addEventListener('click', function() {
    const accountsList = document.getElementById('accounts-list');
    if (accountsList.style.display === 'none') {
        accountsList.style.display = 'block';
        displayAccounts();
        this.textContent = 'Hide Saved Accounts';
    } else {
        accountsList.style.display = 'none';
        this.textContent = 'Show Saved Accounts';
    }
});

window.onload = displayAccounts;
