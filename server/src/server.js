const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app)
//const cors = require("cors")
const socketio = require("socket.io")
const formatMessage = require("./utils/message")
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users")
const io = socketio(server);
const botname = "Devlopers room"

//run when client connects
io.on("connection" , socket => {
    console.log("new client has been connected")
    socket.on("joinRoom" , ({username , room})=>{
        const user = userJoin(socket.id , username , room);
        socket.join(user.room);

        //welcome new user
        socket.emit("message" ,formatMessage(botname , `${user.username} welcome to the ${user.room} group`) )

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit("message" , formatMessage(botname , `${user.username} has joined the chat`))

        //send users and room info
        io.to(user.room).emit("roomUsers" , {
            room : user.room,
            users : getRoomUsers(user.room)
        })

        //listen for chat messages
        socket.on("chatMessage" , msg => {
            console.log(msg)
            const user = getCurrentUser(socket.id)
            io.to(user.room).emit("message" , formatMessage(user.username , msg))
        })


        //when client diconnect
        socket.on("disconnect" , ()=>{
            const user = userLeave(socket.id)
            if(user){
                io.to(user.room).emit("message" , formatMessage(botname , `${user.username} has left the chat`))
            }
            //after user left again send the users and room details
            io.to(user.room).emit("roomUsers" , {
                room : user.room,
                users : getRoomUsers(user.room)
            })
        })
    })
})


const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));