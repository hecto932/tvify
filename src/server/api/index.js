import express from 'express'

const router = express.Router()

var votes = {} // object, dictionary, hashtable

// GET /votes
router.get('/votes', (req, res)  => {
	console.log('GET /votes')
	res.json(votes)
})
// POST /vote/<id>
router.post('/vote/:id', (req, res) => {
	let id = req.params.id
	
	if(votes[id] === undefined)
		votes[id] = 1
	else
		votes[id] += 1

	console.log({ votes : votes[id] })
	res.json({ votes : votes[id] })
})


export default router