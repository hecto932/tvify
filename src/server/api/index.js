import express from 'express'
import tvmaze from 'tv-maze'
import Vote from 'src/server/models'

const router = express.Router()
const client = tvmaze.createClient()

function addVotes (shows, callbacks) {
	Vote.find({}, (err, votes) => {
		if (err) votes = []

		shows = shows.map((show) => {
			let vote = votes.filter(vote => vote.showId === show.id)[0]
			show.count = vote ? vote.count : 0
			return show
		})

		callbacks(shows)
	})
}

router.get('/shows', (req, res) => {
	client.shows((err, shows) => {
		if(err) return res.sendStatus(500).json(err)

		addVotes(shows, shows => {
			res.json(shows)
		})
	})
})

// GET /search
router.get('/search', (req, res) => {
	let query = req.query.q

	client.search(query, (err, shows) => {
		if(err) return res.sendStatus(500).json(err)

		shows = shows.map(show => show.show)

		addVotes(shows, shows => { res.json(shows) })
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