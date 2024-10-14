const messages = [];
const channels = ['general'];
const friends = [];

const messagesList = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const channelList = document.getElementById('channel-list');
const channelForm = document.getElementById('channel-form');
const channelNameInput = document.getElementById('channel-name');
const friendList = document.getElementById('friend-list');
const addFriendForm = document.getElementById('add-friend-form');
const friendUsernameInput = document.getElementById('friend-username');
const currentChannel = document.getElementById('current-channel');

function displayMessages() {
  messagesList.innerHTML = '';
  messages.forEach(message => {
    if (message.channel === currentChannel.textContent) {
      const li = document.createElement('li');
      li.textContent = `${message.username}: ${message.content}`;
      messagesList.appendChild(li);
    }
  });
}

function sendMessage(event) {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (message !== '') {
    messages.push({
      username: 'User', // Замените на настоящее имя пользователя
      channel: currentChannel.textContent,
      content: message
    });
    messageInput.value = '';
    displayMessages();
  }
}

function displayChannels() {
  channelList.innerHTML = '';
  channels.forEach(channel => {
    const li = document.createElement('li');
    li.textContent = channel;
    li.addEventListener('click', () => {
      setCurrentChannel(channel);
    });
    channelList.appendChild(li);
  });
}

function setCurrentChannel(channel) {
  currentChannel.textContent = channel;
  document.querySelector('#channel-list li.active').classList.remove('active');
  const channelElement = document.querySelector(`#channel-list li[data-channel="${channel}"]`);
  channelElement.classList.add('active');
  displayMessagesForChannel(channel);
}

function displayMessagesForChannel(channel) {
  displayMessages();
}

function createChannel(event) {
  event.preventDefault();
  const channelName = channelNameInput.value.trim();
  if (channelName !== '') {
    channels.push(channelName);
    displayChannels();
    setCurrentChannel(channelName);
    channelNameInput.value = '';
  }
}

function displayFriends() {
  friendList.innerHTML = '';
  friends.forEach(friend => {
    const li = document.createElement('li');
    li.textContent = friend.username;
    friendList.appendChild(li);
  });
}

function addFriend(event) {
  event.preventDefault();
  const friendUsername = friendUsernameInput.value.trim();
  if (friendUsername !== '') {
    friends.push({ username: friendUsername });
    displayFriends();
    friendUsernameInput.value = '';
  }
}

messageForm.addEventListener('submit', sendMessage);
channelForm.addEventListener('submit', createChannel);
addFriendForm.addEventListener('submit', addFriend);

displayChannels();
setCurrentChannel('general');
displayFriends();
