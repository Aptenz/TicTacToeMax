const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const clientPath = `${__dirname}/../client`

console.log(`serving static from ${clientPath}`)
app.use(express.static(clientPath))

const server = http.createServer(app)
const io = socketio(server)
const users = {}
var totalPlayers = 0
io.on('connection', socket => {
  totalPlayers++
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.emit('user-connected', {name, totalPlayers})
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
    totalPlayers--
  })
  console.log("New User Joined, Total Players: " + totalPlayers)
})

server.listen(8080, () => {
  console.log('server is ready')
})
