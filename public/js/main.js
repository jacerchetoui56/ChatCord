const chatForm = document.querySelector('#chat-form')
const messageInput = document.querySelector('#msg')
const chatMessages = document.querySelector('.chat-messages')
const usersDOM = document.querySelector('#users')

var socket = io();

//get the room and the username
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('join-room', { username, room })

socket.on('message', (response) => addNewMessage(response.username, response.message, response.time))

socket.on('room-members', users => {
    console.log(users)
    usersDOM.innerHTML = ''
    users.map(user => {
        const li = document.createElement('li')
        li.innerHTML = `<li>${user.username}</li>`
        usersDOM.append(li)
    })
})
//? message submit

chatForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    messageInput.value = ''
    socket.emit('chat-message', { message, username }, addNewMessage)
    messageInput.focus()
})

function addNewMessage(username, message, time) {
    const div = document.createElement('div')
    div.innerHTML = `<div class="message">
    <p class="meta">${username} <span>${time}</span></p>
    <p class="text">
        ${message}
    </p>
</div>`
    chatMessages.append(div)
    chatMessages.scrollTo({ top: chatMessages.scrollHeight })
}   