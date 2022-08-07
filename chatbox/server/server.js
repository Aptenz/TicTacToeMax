const http = require('http')
const express = require('express')
const socketio = require('socket.io') // we use for sending data across to server and client

const app = express()
const clientPath = `${__dirname}/../client`

console.log(`serving static from ${clientPath}`)
app.use(express.static(clientPath))


const server = http.createServer(app)
const io = socketio(server)
const users = {}
// For socket io.on('connection') everytime a user runs the website it will call this function
io.on('connection', socket => {
  // our terminal will tell us if a user has connected
  console.log('user connected')
   // everytime a client runs it will run this new-user
  socket.on('new-user', name => {
    // socket.id is a unique id given by socketio and we can store user ids this way
    users[socket.id] = name
    // we will broadcast to every user except the one who called this function
    // call the user-connected socket
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id]})
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

server.listen(8080, () => {
  console.log('server is ready')
})
