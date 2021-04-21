const users = [];

//join user to chat
const userJoin = (id, username , room) => {
    const user = {id , username , room};
    users.push(user);
    return user
}

// get current user
const getCurrentUser = (id) => users.find(user => user.id === id)

//Get room users
const getRoomUsers = (room) => users.filter(user => user.room === room)

//user leaves room
const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id)
    return users.splice(index , 1)[0];
}

module.exports = {userJoin , getCurrentUser , getRoomUsers , userLeave}