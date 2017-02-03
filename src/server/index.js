import http from 'http'
import express from 'express'
import api from 'src/server/api'
import socketio from 'socket.io'
import mongoose from 'mongoose'
import { incrementVote } from 'src/server/lib'

mongoose.connect('mongodb://localhost/tvify')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

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

			socket.emit('vote:done', vote) 
		})
	})
})

server.listen(3000, () => {
	console.log('Servidor iniciado con Express en el puerto 3000')
})
