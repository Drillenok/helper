const messages = [];
const servers = JSON.parse(localStorage.getItem('servers')) || [];
const friends = JSON.parse(localStorage.getItem('friends')) || [];
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
let currentUsername = 'Пользователь';
let currentAvatar = 'https://via.placeholder.com/50';
let currentServer = servers[0];

// Отображение серверов в списке серверов
function displayServers() {
  const serverList = document.getElementById('server-list');
  serverList.innerHTML = '';
  servers.forEach(server => {
    const li = document.createElement('li');
    li.textContent = server.name;
    li.addEventListener('click', () => {
      setCurrentServer(server);
    });
    serverList.appendChild(li);
  });
}

// Установка текущего сервера
function setCurrentServer(server) {
  currentServer = server;
  document.querySelector('#server-list li.active').classList.remove('active');
  const serverElement = document.querySelector(`#server-list li[data-server="${server.id}"]`);
  serverElement.classList.add('active');
  displayMessagesForChannel(currentServer.channels[0].name);
}

// Создание нового сервера
function createServer(event) {
  event.preventDefault();
  const serverName = document.getElementById('server-name').value.trim();
  if (serverName !== '') {
    const newServer = {
      id: servers.length + 1,
      name: serverName,
      channels: [{ name: 'Общий', messages: [] }],
    };
    servers.push(newServer);
    localStorage.setItem('servers', JSON.stringify(servers));
    displayServers();
    setCurrentServer(newServer);
    document.getElementById('server-name').value = '';
  }
}

// Отображение друзей в списке друзей
function displayFriends() {
  const friendList = document.getElementById('friend-list');
  friendList.innerHTML = '';
  friends.forEach(friend => {
    const li = document.createElement('li');
    const status = friend.status === 'online' ? 'online' : 'offline';
    li.innerHTML = `<span class="${status}">${friend.username}</span>`;
    friendList.appendChild(li);
  });
}

// Добавление нового друга
function addFriend(event) {
  event.preventDefault();
  const friendUsername = document.getElementById('friend-username').value.trim();
  if (friendUsername !== '') {
    if (!friends.some(friend => friend.username === friendUsername)) {
      friends.push({ username: friendUsername, status: 'online' });
      localStorage.setItem('friends', JSON.stringify(friends));
      displayFriends();
      document.getElementById('friend-username').value = '';
    } else {
      alert('Пользователь уже добавлен в друзья.');
    }
  } else {
    alert('Пожалуйста, введите имя пользователя.');
  }
}

// Отображение сообщений в чате для текущего канала
function displayMessagesForChannel(channelName) {
  const messagesList = document.getElementById('messages');
  messagesList.innerHTML = '';
  currentServer.channels.forEach(channel => {
    if (channel.name === channelName) {
      channel.messages.forEach(message => {
        const li = document.createElement('li');
        if (message.file) {
          li.innerHTML = `
            <span>${message.content}</span>
            <a href="${URL.createObjectURL(message.file)}" download="${message.file.name}">${message.file.name}</a>
          `;
        } else {
          li.textContent = message.content;
        }
        messagesList.appendChild(li);
      });
    }
  });
}

// Отправка сообщения с файлом
function sendMessage(event) {
  event.preventDefault();
  const message = document.getElementById('message-input').value.trim();
  const file = document.getElementById('file-input').files[0];
  if (message !== '' || file) {
    const messageObject = {
      content: message,
      channel: currentServer.channels[0].name,
    };
    if (file) {
      messageObject.file = file;
    }
    currentServer.channels[0].messages.push(messageObject);
    document.getElementById('message-input').value = '';
    document.getElementById('file-input').value = null;
    displayMessagesForChannel(currentServer.channels[0].name);
  }
}

// Добавление обработчиков событий для отправки сообщения с файлом и выбора файла
document.getElementById('message-form').addEventListener('submit', sendMessage);
document.getElementById('attach-file-button').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

// Отображение текущего имени пользователя и аватара в профиле
function displayProfile() {
  document.getElementById('current-username-value').textContent = currentUsername;
  document.getElementById('current-avatar').src = currentAvatar;
}

// Обновление текущего имени пользователя и аватара
function updateProfile(event) {
  event.preventDefault();
  const newUsername = document.getElementById('username').value.trim();
  const avatarFile = document.getElementById('avatar').files[0];
  if (newUsername !== '') {
    currentUsername = newUsername;
    displayProfile();
  }
  if (avatarFile) {
    const reader = new FileReader();
    reader.onload = () => {
      currentAvatar = reader.result;
      displayProfile();
    };
    reader.readAsDataURL(avatarFile);
  }
}

// Добавление обработчика события для сохранения изменений профиля
document.getElementById('profile-form').addEventListener('submit', updateProfile);

// Регистрация нового пользователя
function register(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (username !== '' && password !== '') {
    if (!registeredUsers.some(user => user.username === username)) {
      registeredUsers.push({ username, password });
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      document.getElementById('registration-message').textContent = 'Регистрация успешна! Теперь вы можете войти.';
      document.getElementById('registration-form').reset();
    } else {
      document.getElementById('registration-message').textContent = 'Имя пользователя уже занято. Пожалуйста, выберите другое имя пользователя.';
    }
  } else {
    document.getElementById('registration-message').textContent = 'Пожалуйста, заполните все поля.';
  }
}

// Добавление обработчика события для регистрации нового пользователя
document.getElementById('registration-form').addEventListener('submit', register);

// Отображение серверов, друзей, профиля и сообщений при загрузке страницы
displayServers();
displayFriends();
displayProfile();
displayMessagesForChannel(currentServer.channels[0].name);
