import http from 'http'
import express from 'express'
import api from 'src/server/api'
import socketio from 'socket.io'
import mongoose from 'mongoose'
import { incrementVote } from 'src/server/lib'


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGOPATH || 'mongodb://localhost/tvify')

// Middleware
app.use(express.static('public'))

app.use('/api/votes', (req, res, next) => {
	console.log('Middleware 1')
	next()
})

app.use('/api/votes', (req, res, next) => {
	console.log('Middleware 2')
	next()
})

app.use('/api', api)

io.on('connection', (socket) => {
	console.log(`Connected ${socket.id}`)

	socket.on('vote', (id) => {
		incrementVote(id, (err, vote) => {
			if (err) return socket.emit('vote:error', err)

			io.sockets.emit('vote:done', vote) 
		})
	})

	socket.on('join', room => {
		socket.room = room
		socket.join(room)
		//socket.leave(room)
	})

	socket.on('message', msg => {
		socket.broadcast.to(socket.room).emit('message', msg)
	})
})

server.listen(port, () => {
	console.log(`Servidor iniciado con Express en el puerto ${port}`)
})
