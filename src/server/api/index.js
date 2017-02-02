import express from 'express'
import tvmaze from 'tv-maze'
import Vote from 'src/server/models'

const router = express.Router()
const client = tvmaze.createClient()

router.get('/shows', (req, res) => {
	client.shows((err, shows) => {
		if(err) return res.sendStatus(500).json(err)

		res.json(shows)
	})
})

// GET /votes
router.get('/votes', (req, res)  => {
	console.log('GET /votes')
	Vote.find({}, (err, docs) => {
		if(err) return res.sendStatus(500).json(err)

		res.json(docs)
	})
})

// POST /vote/<id>
router.post('/vote/:id', (req, res) => {
	let id = req.params.id
	
	var onSave = function onSave(vote){
		return (err, data) => {
			if(err) return res.sendStatus(500).json(data)

			res.json(vote)
		}
	}


	Vote.findOne({ showId : id }, (err, doc) => {
		if(doc) {
			doc.count+=1
			doc.save(onSave(doc))
		}else {
			let vote = new Vote()
			vote.showId = id
			vote.count = 1
			vote.save(onSave(vote))
		}
	})

	
})


export default router