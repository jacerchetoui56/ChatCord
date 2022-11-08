const users = []


const userJoin = (id, username, room) => {
    const user = { id, username, room }
    users.push(user)
    return user
}

const userLeave = (username) => {
    const index = users.findIndex(user => user.username === username)
    if (index !== -1) {
        return users.splice(index, 1)[0].username
    }
    return
}

const getUsersInTheRoom = (room) => {
    return users.filter(user => user.room === room)
}
const getUser = (id) => users.find(user => user.id === id)

module.exports = { getUser, userJoin, users, userLeave, getUsersInTheRoom }