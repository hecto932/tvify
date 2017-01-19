import express from 'express'
const app = express()

// Middleware
app.use(express.static('public'))

// GET /votes
app.get('/votes', (req, res)  => {
	res.json([])
})
// POST /vote/<id>
app.post('/vote/:id', (req, res) => {

})

app.listen(3000, () => {
	console.log('Servidor iniciado con Express en el puerto 3000')
})
