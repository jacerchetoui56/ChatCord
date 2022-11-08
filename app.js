const express = require('express')
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)

const formatMessage = require('./utils/messages')
const { userLeave, users, userJoin, getUser, getUsersInTheRoom } = require('./utils/users')
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

//run when client connects
io.on('connection', socket => {

    io.to(socket.id).emit('message', formatMessage('Admin', 'Welcom to ChatCord'))
    //* broadcast when user connects
    // socket.broadcast.emit('message', formatMessage('Admin', `${socket.id} is connected`))

    //* receiving a message from the client side

    //* joining a room
    socket.on('join-room', ({ username, room }) => {
        userJoin(socket.id, username, room)
        socket.join(room)
        io.to(room).emit('room-members', getUsersInTheRoom(room))
        socket.broadcast.to(room).emit('message', formatMessage(username, `${username} joined the room`))
        socket.on('chat-message', ({ message, username }, cb) => {
            socket.broadcast.emit('message', formatMessage(username, message))
            cb('You', message, formatMessage().time)
        })
        socket.on('disconnect', (socket) => {
            console.log('user disconnected')
            io.to(room).emit('message', formatMessage('Admin', `${userLeave(username)} left the room`))
        })
    })

    //! when client disconnects

    // socket.on('disconnect', () => io.emit('message', formatMessage("Admin", `${socket.id} left the chat`)))
})



server.listen(port, () => console.log(`Server is listening on port ${port}`))