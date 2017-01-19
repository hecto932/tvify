import express from 'express'
const app = express()

const votes = {} // object, dictionary, hashtable

// Middleware
app.use(express.static('public'))

// GET /votes
app.get('/votes', (req, res)  => {
	res.json(votes)
})
// POST /vote/<id>
app.post('/vote/:id', (req, res) => {
	let id = req.params.id
	
	if(votes[id] === undefined)
		votes[id] = 1
	else
		votes[id] += 1

	console.log({ votes : votes[id] })
	res.json({ votes : votes[id] })
})

app.listen(3000, () => {
	console.log('Servidor iniciado con Express en el puerto 3000')
})
